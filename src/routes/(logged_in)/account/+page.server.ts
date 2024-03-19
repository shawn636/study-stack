import type { User } from '@prisma/client';

import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load = (async ({ cookies, parent }) => {
    await parent();
    const sessionId = auth.getSession(cookies);
    const isValid = await auth.validateSession(sessionId ?? '');
    let user: User | undefined;

    if (isValid && sessionId) {
        user = await auth.getUser(sessionId);
    } else {
        cookies = auth.deleteSessionCookie(cookies);
        redirect(302, '/auth/login');
    }
    return { user };
}) satisfies PageServerLoad;
