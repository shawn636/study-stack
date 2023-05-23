import { auth } from '$lib/server/lucia';
import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

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
			} catch (error) {
				console.log(error);
				return fail(400);
			}
		}
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');
};
