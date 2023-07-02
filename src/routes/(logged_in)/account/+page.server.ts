import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type User from '$lib/models/user';

export const load = (async ({ cookies }) => {
    const session_id = auth.getSession(cookies);
    const is_valid = await auth.validateSession(session_id ?? '');
    let user: User | undefined;

    if (is_valid && session_id) {
        user = await auth.getUser(session_id);
    } else {
        cookies = auth.deleteSessionCookie(cookies);
        throw redirect(302, '/auth/login');
    }
    return { user };
}) satisfies PageServerLoad;
