import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const POST = (async ({ cookies }) => {
    const sessionId = auth.getSession(cookies);

    if (!sessionId) {
        error(401, 'You are not logged in.');
    }

    try {
        await auth.logout(sessionId);
        cookies = auth.deleteSessionCookie(cookies);
        cookies.set('userCache', '', { path: '/', maxAge: 0 });
    } catch (e) {
        error(500, 'Unable to log out due to server error.');
    }

    return new Response(null, {
        status: 200
    });
}) satisfies RequestHandler;
