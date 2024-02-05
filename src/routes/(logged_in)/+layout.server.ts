import type { LayoutServerLoad } from './$types';
import type User from '$lib/models/user';
import { auth } from '$lib/server/auth';

export const load = (async ({ cookies }) => {
    const sessionId = auth.getSession(cookies);
    let user: User | undefined;

    if (sessionId) {
        const is_valid = await auth.validateSession(sessionId);
        if (is_valid) {
            user = await auth.getUser(sessionId);
        } else {
            cookies = auth.deleteSessionCookie(cookies);
        }
    }
    return { user };
}) satisfies LayoutServerLoad;
