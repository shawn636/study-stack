import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies, parent }) => {
    await parent();
    const session_id = auth.getSession(cookies);
    const is_valid = await auth.validateSession(session_id ?? '');
    if (!is_valid) {
        cookies = auth.deleteSessionCookie(cookies);
        redirect(302, '/auth/login');
    } else {
        const user = await auth.getUser(session_id ?? '');
        return { user };
    }
}) satisfies PageServerLoad;
