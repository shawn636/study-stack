import type { User } from '$lib/models/types/database.types';

import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load = (async ({ cookies, parent }) => {
    let user: User | undefined = undefined;
    const sessionId = auth.getSession(cookies);
    const isValid = await auth.validateSession(sessionId ?? '');
    if (!isValid) {
        cookies = auth.deleteSessionCookie(cookies);
        redirect(302, '/auth/login');
    } else {
        user = await auth.getUser(sessionId ?? '');
    }
    await parent();
    return { user };
}) satisfies PageServerLoad;
