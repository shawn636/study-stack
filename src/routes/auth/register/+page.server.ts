import { auth } from '$lib/server/lucia';
import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import { db } from '$lib/database';
import { registrationForm } from '$lib/schema/registration-form';
import { ValidationError } from 'yup';
import { errorPadding } from '$lib/server/util';

interface FormData {
	name: string;
	email: string;
	password1: string;
	password2: string;
}

const createUser = async (values: FormData) => {
	const password = values.password1;
	const email = values.email;

	const user = await auth.createUser({
		primaryKey: {
			providerId: 'email',
			providerUserId: values.email,
			password
		},
		attributes: {
			email
		}
	});
	try {
		const conn = db.connection();
		const query = `INSERT INTO User (auth_user_id, email, organizationId, name) VALUES (?, ?, NULL, ?);`;
		await conn.execute(query, [user.userId, values.email, values.name]);
	} catch (e: unknown) {
		await auth.deleteUser(user.userId);
		await auth.deleteDeadUserSessions(user.userId);
		throw e;
	}

	return user.userId;
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();

		const values: FormData = {
			name: form.get('name') as string,
			email: form.get('email') as string,
			password1: form.get('password1') as string,
			password2: form.get('password2') as string
		};

		try {
			await registrationForm.validate(values, { abortEarly: false });
			const userId = await createUser(values);

			if (userId) {
				const session = await auth.createSession(userId);
				locals.auth.setSession(session);
			}
		} catch (e: unknown) {
			await errorPadding();
			handleError(e);
		}
	}
};

const handleError = (e: unknown) => {
	if (e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_KEY_ID') {
		throw error(400, 'The email provided is already in use.');
	} else if (e instanceof ValidationError) {
		throw error(400, 'The data provided is invalid. Please try again.');
	} else if (e instanceof Error && e.message.toLowerCase().includes('duplicate entry')) {
		throw error(400, 'The email provided is already in use.');
	}
	console.log(e);
	throw error(500, 'An unknown error ocurred, please try again later.');
};

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');
};
