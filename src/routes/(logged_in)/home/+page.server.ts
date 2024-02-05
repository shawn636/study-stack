import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies, parent }) => {
    await parent();
    const sessionId = auth.getSession(cookies);
    const isValid = await auth.validateSession(sessionId ?? '');
    if (!isValid) {
        cookies = auth.deleteSessionCookie(cookies);
        redirect(302, '/auth/login');
    } else {
        const user = await auth.getUser(sessionId ?? '');
        return { user };
    }
}) satisfies PageServerLoad;
