import type { User } from '$lib/models/types/database.types';

import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load = (async ({ cookies, parent }) => {
    const sessionId = auth.getSession(cookies);
    const isValid = await auth.validateSession(sessionId ?? '');
    let user: User | undefined;

    if (isValid && sessionId) {
        user = await auth.getUser(sessionId);
        await parent();
    } else {
        cookies = auth.deleteSessionCookie(cookies);
        redirect(302, '/auth/login');
    }
    return { user };
}) satisfies PageServerLoad;
