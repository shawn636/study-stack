import { csrf } from '$lib/server/csrf';
// import { db } from '$lib/server/database';

import { errorPadding } from '$lib/server/util';
import { error } from '@sveltejs/kit';
import { ValidationError } from 'yup';

import type { RequestHandler } from './$types';

export const POST = (async ({ cookies, request }) => {
    await csrf.validateCookies(cookies);

    try {
        const data = await request.json();

        if (!data.email) {
            error(400, 'email is required');
        }
        console.log(`Subscribing ${data.email}`);
    } catch (e: unknown) {
        console.error(e);
        await errorPadding();
        handleError(e);
    }

    return new Response(null, {
        status: 204
    });
}) satisfies RequestHandler;

const handleError = (e: unknown) => {
    if (e instanceof ValidationError) {
        error(400, 'data provided is invalid');
    } else {
        error(500, 'An unknown error ocurred, please try again later.');
    }
};
