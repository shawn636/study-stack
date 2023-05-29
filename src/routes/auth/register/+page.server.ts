import { auth } from '$lib/server/lucia';
import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();

		const name = form.get('name');
		const email = form.get('email');
		const password1 = form.get('password1');
		const password2 = form.get('password2');

		console.log(`Received values from form: ${[name, email, password1, password2]}`);

		// Validate inputs on server

		if (
			typeof name !== 'string' ||
			typeof email !== 'string' ||
			typeof password1 !== 'string' ||
			typeof password2 !== 'string'
		) {
			return fail(400);
		} else {
			try {
				const password = password1;
				const username = email;

				const user = await auth.createUser({
					primaryKey: {
						providerId: 'username',
						providerUserId: username,
						password
					},
					attributes: {
						username
					}
				});
				const session = await auth.createSession(user.userId);
				locals.auth.setSession(session);
			} catch (e: unknown) {
				handleError(e);
			}
		}
	}
};

const handleError = (e: unknown) => {
	if (e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_KEY_ID') {
		throw error(400, 'The email provided is already in use.');
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
