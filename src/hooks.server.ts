import type { Handle } from '@sveltejs/kit';
import { setDefaultSettings } from '$lib/server/site-config';

const ready = new Promise((resolve) => {
    const task1 = setDefaultSettings();
    Promise.all([task1]).then(() => resolve(true));
});

export const handle: Handle = async ({ event, resolve }) => {
    await ready;
    const response = await resolve(event);
    return response;
};
