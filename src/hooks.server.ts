import type { Handle } from '@sveltejs/kit';

import { csrf } from '$lib/server/csrf';

export const handle: Handle = async ({ event, resolve }) => {
    const newEvent = event;
    const newCookies = await csrf.validateAndSetCookie(event.cookies);
    newEvent.cookies = newCookies;
    return await resolve(newEvent);
};
