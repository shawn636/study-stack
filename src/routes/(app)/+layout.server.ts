import type { LayoutServerLoad } from './$types';
import type User from '$lib/models/user';
import { auth } from '$lib/server/auth';

export const load = (async ({ cookies }) => {
	const session_id = auth.getSession(cookies);
	let user: User | undefined;

	if (session_id) {
		const is_valid = await auth.validateSession(session_id);
		if (is_valid) {
			user = await auth.getUser(session_id);
		} else {
			cookies = auth.deleteSessionCookie(cookies);
		}
	}
	return { user };
}) satisfies LayoutServerLoad;
