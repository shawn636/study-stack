import type { RequestHandler } from './$types';
import { auth } from '$lib/server/auth';
import { csrf } from '$lib/server/csrf';
import { error } from '@sveltejs/kit';

export const POST = (async ({ cookies }) => {
    await csrf.validateCookies(cookies);
    const session_id = auth.getSession(cookies);

    if (!session_id) {
        error(401, 'You are not logged in.');
    }

    try {
        await auth.logout(session_id);
        cookies = auth.deleteSessionCookie(cookies);
    } catch (e) {
        console.log(e);
        error(500, 'Unable to log out due to server error.');
    }

    return new Response(null, {
        status: 200
    });
}) satisfies RequestHandler;
