import { csrf } from '$lib/server/csrf';
// import { db } from '$lib/server/database';

import { type SubscribeForm, subscribeForm } from '$lib/models/forms/subscribe';
import { errorPadding } from '$lib/server/util';
import { error } from '@sveltejs/kit';
import { ValidationError } from 'yup';

import type { RequestHandler } from './$types';

export const POST = (async ({ cookies, request }) => {
    await csrf.validateCookies(cookies);

    try {
        const data = await request.formData();

        const form: SubscribeForm = {
            email: data.get('email') as string
        };

        await subscribeForm.validate(form, { abortEarly: true });
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
