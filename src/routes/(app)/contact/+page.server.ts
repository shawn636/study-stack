import type { User } from '$lib/models/types/database.types';

import { auth } from '$lib/server/auth';

import type { PageServerLoad } from './$types';

export const load = (async ({ cookies, parent }) => {
    await parent();
    const sessionId = auth.getSession(cookies);
    const isValid = await auth.validateSession(sessionId ?? '');
    let user: User | undefined;

    if (isValid) {
        try {
            user = await auth.getUser(sessionId ?? '');
        } catch {
            // Igbnore any errors. The user will be undefined.
        }
    }

    return { user };
}) satisfies PageServerLoad;
