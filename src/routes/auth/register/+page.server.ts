import type { Actions } from '@sveltejs/kit';

import { type RegistrationForm, registrationForm } from '$lib/models/forms/registration';
import { auth } from '$lib/server/auth';
import { errorPadding } from '$lib/server/util';
import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { ValidationError } from 'yup';

import type { PageServerLoad } from './$types';

export const actions: Actions = {
    default: async ({ cookies, request }) => {
        const form = await request.formData();

        const values: RegistrationForm = {
            email: form.get('email') as string,
            name: form.get('name') as string,
            password1: form.get('password1') as string,
            password2: form.get('password2') as string
        };

        try {
            await registrationForm.validate(values, { abortEarly: true });
            await auth.createUser(values.email, values.password1, values.name);
            const sessionId = await auth.login(values.email, values.password1);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cookies = auth.setSessionCookie(sessionId, cookies);
        } catch (e: unknown) {
            await errorPadding();
            handleError(e);
        }
    }
};

const handleError = (e: unknown) => {
    if (e instanceof ValidationError) {
        error(400, 'data provided is invalid');
    } else if (!(e instanceof Error))
        error(500, 'An unknown error ocurred, please try again later.');
    if (e.message === 'AUTH_DUPLICATE_EMAIL') error(400, 'This email is already in use.');

    error(500, 'An unknown error occurred. Please try again.');
};

export const load: PageServerLoad = async ({ cookies, parent }) => {
    const signedIn = await auth.validateCookies(cookies);
    await parent();
    if (signedIn) redirect(302, '/');
};
