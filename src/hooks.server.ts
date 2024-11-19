import type { Handle } from '@sveltejs/kit';

import { json, text } from '@sveltejs/kit';
import { setDefaultSettings } from '$lib/server/site-config';

const ready = new Promise((resolve) => {
    const task1 = setDefaultSettings();
    Promise.all([task1]).then(() => resolve(true));
});

const csrf = (allowedPaths: string[]): Handle => {
    const csrfHandler: Handle = async ({ event, resolve }) => {
        const { request, url } = event;
        const methodRequiresCsrf = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
        const mismatchedOrigin = request.headers.get('origin') !== url.origin;
        const isPathAllowed = allowedPaths.includes(url.pathname);

        const isForbidden = methodRequiresCsrf && mismatchedOrigin && !isPathAllowed;

        if (isForbidden) {
            const message = `Cross-site ${request.method} form submissions are forbidden`;
            if (request.headers.get('accept') === 'application/json') {
                return json({ message }, { status: 403 });
            }
            return text(message, { status: 403 });
        }

        return resolve(event);
    };

    return csrfHandler;
};

export const handle: Handle = async ({ event, resolve }) => {
    await ready;

    const whiteListedEndpoints: string[] = [];
    const csrfHandler = csrf(whiteListedEndpoints);
    return csrfHandler({ event, resolve });
};
