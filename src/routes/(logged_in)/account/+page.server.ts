import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies }) => {
    const session_id = auth.getSession(cookies);
    const is_valid = await auth.validateSession(session_id ?? '');
    if (!is_valid) {
        cookies = auth.deleteSessionCookie(cookies);
        throw redirect(302, '/auth/login');
    }
}) satisfies PageServerLoad;
