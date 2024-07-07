import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load = (async ({ cookies, parent }) => {
    const sessionId = auth.getSession(cookies);
    const isValid = await auth.validateSession(sessionId ?? '');
    await parent();
    if (!isValid || !sessionId) {
        cookies = auth.deleteSessionCookie(cookies);
        redirect(302, '/auth/login');
    }
}) satisfies PageServerLoad;
