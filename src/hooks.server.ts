import type { Handle } from '@sveltejs/kit';

import { csrf } from '$lib/server/csrf';

export const handle: Handle = async ({ event, resolve }) => {
    event.cookies = await csrf.validateAndSetCookie(event.cookies);
    return await resolve(event);
};
