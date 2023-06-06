import { auth } from '$lib/server/lucia';
import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import { loginForm } from '$lib/schema/login-form';
import { ValidationError } from 'yup';
import { errorPadding } from '$lib/server/util';
import { csrf } from '$lib/server/csrf';
import { sleep } from '$lib/server/util';

interface FormData {
	email: string;
	password: string;
}

const authenticateUser = async (values: FormData) => {
	const password = values.password;
	const email = values.email;
	try {
		console.log('Authenticating user...');
		const key = await auth.useKey('email', email, password);
		sleep(3000);
		console.log('User authenticated!');
		return key.userId;
	} catch (e: unknown) {
		handleError(e);
	}
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();

		const token = request.headers.get('x-csrf-token') as string;
		const valid_token = await csrf.validateToken(token);
		if (!valid_token) {
			throw error(403, 'Cross-site form submissions are forbidden.');
		}

		const values: FormData = {
			email: form.get('email') as string,
			password: form.get('password') as string
		};

		values.email = values.email.trim().toLowerCase();
		values.password = values.password.trim();

		try {
			await loginForm.validate(values, { abortEarly: false });
			const userId = await authenticateUser(values);

			console.log('Received user id: ' + userId);
			if (userId) {
				console.log('Creating session...');
				const session = await auth.createSession(userId);
				console.log('session created!');
				console.log('Setting session...');
				locals.auth.setSession(session);
				console.log('session set!');
			}
		} catch (e: unknown) {
			await errorPadding();
			handleError(e);
		}
	}
};

const handleError = (e: unknown) => {
	console.log('Error occurred while authenticating user.');
	console.log(e);
	console.log('\n\n');
	if (
		e instanceof LuciaError &&
		(e.message === 'AUTH_INVALID_KEY_ID' ||
			e.message === 'AUTH_INVALID_PASSWORD' ||
			e.message === 'AUTH_INVALID_USER_ID')
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

export const load: PageServerLoad = async ({ locals, cookies }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');
	const csrf_token = cookies.get('csrf-token');
	return { csrf_token };
};
