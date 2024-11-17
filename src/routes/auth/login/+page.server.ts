import type { Actions } from '@sveltejs/kit';

import { type LoginForm, loginForm } from '$lib/models/forms/login';
import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import { errorPadding } from '$lib/server/util';
import { redirect } from '@sveltejs/kit';
import { ValidationError } from 'yup';

import type { PageServerLoad } from './$types';

export const actions: Actions = {
    default: async ({ cookies, request }) => {
        const form = await request.formData();
        const values: LoginForm = {
            email: form.get('email') as string,
            password: form.get('password') as string
        };
        values.email = values.email.trim().toLowerCase();
        values.password = values.password.trim();

        try {
            await loginForm.validate(values);

            const sessionId = await auth.login(values.email, values.password);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cookies = auth.setSessionCookie(sessionId, cookies);
        } catch (e: unknown) {
            await errorPadding();
            handleError(e);
        }
    }
};

const handleError = (e: unknown) => {
    if (e instanceof ValidationError) error(400, 'data provided is invalid');
    else if (!(e instanceof Error)) error(500, 'An unknown error ocurred, please try again later.');
    if (e.message === 'AUTH_INVALID_CREDENTIALS') error(400, 'Invalid credentials.');
};

export const load: PageServerLoad = async ({ cookies }) => {
    const signedIn = await auth.validateCookies(cookies);
    if (signedIn) redirect(302, '/');
};
