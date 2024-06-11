import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

// import { getSettings } from './retrieve-settings';

export const load = (async ({ cookies, parent }) => {
    await parent();
    const sessionId = auth.getSession(cookies);
    const isValid = await auth.validateSession(sessionId ?? '');

    if (isValid && sessionId) {
        // const settings = await getSettings();
        // return { settings };
        return { settings: null };
    } else {
        cookies = auth.deleteSessionCookie(cookies);
        redirect(302, '/auth/login');
    }
}) satisfies PageServerLoad;
