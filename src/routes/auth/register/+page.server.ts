import { auth } from '$lib/server/auth';
import { csrf } from '$lib/server/csrf';

import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { registrationForm } from '$lib/schema/registration-form';
import { errorPadding } from '$lib/server/util';
import { ValidationError } from 'yup';

interface FormData {
    name: string;
    email: string;
    password1: string;
    password2: string;
}

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        await csrf.validateCookies(cookies);
        const form = await request.formData();

        const values: FormData = {
            name: form.get('name') as string,
            email: form.get('email') as string,
            password1: form.get('password1') as string,
            password2: form.get('password2') as string
        };

        try {
            await registrationForm.validate(values, { abortEarly: true });
            await auth.createUser(values.email, values.password1, values.name);
            const session_id = await auth.login(values.email, values.password1);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cookies = auth.setSessionCookie(session_id, cookies);
            console.log('Successfully logged in and set cookie');
        } catch (e: unknown) {
            await errorPadding();
            handleError(e);
        }
    }
};

const handleError = (e: unknown) => {
    // console.log(e)
    if (e instanceof ValidationError) {
        console.log(e.message);
        throw error(400, 'data provided is invalid');
    } else if (!(e instanceof Error))
        throw error(500, 'An unknown error ocurred, please try again later.');
    if (e.message === 'AUTH_DUPLICATE_EMAIL') throw error(400, 'This email is already in use.');

    throw error(500, 'An unknown error occurred. Please try again.');
};

export const load: PageServerLoad = async ({ cookies }) => {
    const signed_in = await auth.validateCookies(cookies);
    if (signed_in) throw redirect(302, '/');
};
