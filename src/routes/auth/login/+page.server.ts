import { auth } from '$lib/server/lucia';
import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import { loginForm } from '$lib/schema/login-form';
import { ValidationError } from 'yup';
import { errorPadding } from '$lib/server/util';

interface FormData {
	email: string;
	password: string;
}

const createUser = async (values: FormData) => {
	const password = values.password;
	const email = values.email;

	const key = await auth.useKey('email', email, password);

	return key.userId;
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();

		const values: FormData = {
			email: form.get('email') as string,
			password: form.get('password') as string
		};

		values.email = values.email.trim().toLowerCase();
		values.password = values.password.trim();

		try {
			await loginForm.validate(values, { abortEarly: false });
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
	if (
		e instanceof LuciaError &&
		(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
	) {
		throw error(400, 'The email or password provided is incorrect.');
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
