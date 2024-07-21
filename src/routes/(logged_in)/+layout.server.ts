import type { User } from '$lib/models/types/database.types';

import { auth } from '$lib/server/auth';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies, parent }) => {
    const sessionId = auth.getSession(cookies);
    let user: User | undefined;

    if (sessionId) {
        const isValid = await auth.validateSession(sessionId);
        if (isValid) {
            user = await auth.getUser(sessionId);
        } else {
            cookies = auth.deleteSessionCookie(cookies);
        }
    }
    await parent();
    return { user };
}) satisfies LayoutServerLoad;
