import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/models/types/database.types';

import { auth } from '$lib/server/auth';

const CACHE_EXPIRATION = 60 * 15; // 15 minutes in seconds

export const load = (async ({ cookies }) => {
    const sessionId = auth.getSession(cookies);
    let user: User | undefined;

    // Check if we have cached user data in cookies
    const cachedUser = cookies.get('userCache');
    if (cachedUser) {
        user = JSON.parse(cachedUser) as User;
        console.debug('Retrieved cached user data from cookies - (app)/+layout.server.ts');
    } else if (sessionId) {
        const isValid = await auth.validateSession(sessionId);
        console.debug('Executing query to validate session - (app)/+layout.server.ts');

        if (isValid) {
            user = await auth.getUser(sessionId);
            console.debug('Executing query to get user - (app)/+layout.server.ts');

            // Set a new cookie with the cached user data
            console.debug('Setting new cookie with user data - (app)/+layout.server.ts');
            cookies.set('userCache', JSON.stringify(user), {
                path: '/',
                maxAge: CACHE_EXPIRATION,
                httpOnly: true // Ensures the cookie is not accessible via client-side JavaScript
            });
        } else {
            cookies = auth.deleteSessionCookie(cookies);
        }
    }
    return { user };
}) satisfies LayoutServerLoad;
