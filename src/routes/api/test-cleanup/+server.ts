import { csrf } from '$lib/server/csrf';
import { cleanup } from '$lib/server/test-utils/cleanup';
import { errorPadding } from '$lib/server/util';
import { error } from '@sveltejs/kit';
import { ValidationError } from 'yup';

import type { RequestHandler } from './$types';

export const DELETE = (async ({ cookies }) => {
    await csrf.validateCookies(cookies);

    try {
        await cleanup();
    } catch (e: unknown) {
        console.error(e);
        await errorPadding();
        handleError(e);
    }

    return new Response(null, {
        headers: {
            'cache-control': 'no-store',
            'content-type': 'application/json;charset=utf-8'
        },
        status: 200
    });
}) satisfies RequestHandler;

const handleError = (e: unknown) => {
    if (e instanceof ValidationError) {
        error(400, 'data provided is invalid');
    } else {
        error(500, 'An unknown error ocurred, please try again later.');
    }
};
