import { auth } from '$lib/server/lucia';
import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();

		const email = form.get('email');
		const password = form.get('password');

		// Validate inputs on server

		if (typeof email !== 'string' || typeof password !== 'string') {
			return fail(400);
		} else {
			try {
				const username = email;
				const key = await auth.useKey('username', username, password);
				const session = await auth.createSession(key.userId);
				locals.auth.setSession(session);
			} catch (e: unknown) {
				handleError(e);
			}
		}
	}
};

const handleError = (e: unknown) => {
	if (e instanceof LuciaError) {
		if (e.message === 'AUTH_INVALID_PASSWORD' || e.message === 'AUTH_INVALID_KEY_ID') {
			console.log(e.message);
			throw error(400, 'The username or password entered is incorrect.');
		}
	}

	console.log(e);
	throw error(500, 'An unknown error ocurred, please try again later.');
};

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');
};
