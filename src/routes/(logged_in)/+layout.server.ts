import type { Cookies } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/models/types/database.types';

import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

const USER_CACHE_COOKIE = 'userCache';
const CACHE_EXPIRATION = 60 * 15; // 15 minutes in seconds

export const load = (async ({ cookies, url }) => {
    const sessionId = auth.getSession(cookies);
    const authRedirect = `/auth/login?redirect=${url.pathname}`;

    if (!sessionId) redirect(302, authRedirect);

    const user = await validateSessionAndGetUser(sessionId, cookies);
    if (!user) redirect(302, authRedirect);

    return { user };
}) satisfies LayoutServerLoad;

// Utility Functions
const getUserFromCache = (cookies: Cookies): User | undefined => {
    const cachedUser = cookies.get(USER_CACHE_COOKIE);

    if (cachedUser) {
        console.debug('Retrieved cached user data from cookies');
        return JSON.parse(cachedUser) as User;
    }
    return undefined;
};

const fetchAndCacheUser = async (sessionId: string, cookies: Cookies): Promise<User> => {
    console.debug('Fetching user data...');
    const user = await auth.getUser(sessionId);

    console.debug('Setting new cookie with user data');
    cookies.set(USER_CACHE_COOKIE, JSON.stringify(user), {
        path: '/',
        maxAge: CACHE_EXPIRATION,
        httpOnly: true // Keep this data server-only
    });

    return user;
};

const validateSessionAndGetUser = async (
    sessionId: string,
    cookies: Cookies
): Promise<User | undefined> => {
    const isValid = await auth.validateSession(sessionId);
    if (!isValid) {
        cookies = auth.deleteSessionCookie(cookies);
        cookies.set(USER_CACHE_COOKIE, '', { path: '/', maxAge: 0 });
        return undefined;
    }

    let user = getUserFromCache(cookies);
    if (!user) {
        user = await fetchAndCacheUser(sessionId, cookies);
    }

    return user;
};
