import { auth } from '$lib/server/auth';
import { csrf } from '$lib/server/csrf';
import type { Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { loginForm } from '$lib/schema/login-form';
import { errorPadding } from '$lib/server/util';
import { ValidationError } from 'yup';

interface FormData {
    email: string;
    password: string;
}

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        await csrf.validateCookies(cookies);

        const form = await request.formData();
        const values: FormData = {
            email: form.get('email') as string,
            password: form.get('password') as string
        };
        values.email = values.email.trim().toLowerCase();
        values.password = values.password.trim();

        try {
            await loginForm.validate(values);

            const session_id = await auth.login(values.email, values.password);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cookies = auth.setSessionCookie(session_id, cookies);
        } catch (e: unknown) {
            await errorPadding();
            handleError(e);
        }
    }
};

const handleError = (e: unknown) => {
    if (e instanceof ValidationError) throw error(400, 'data provided is invalid');
    else if (!(e instanceof Error))
        throw error(500, 'An unknown error ocurred, please try again later.');
    if (e.message === 'AUTH_INVALID_CREDENTIALS') throw error(400, 'Invalid credentials.');
};

export const load: PageServerLoad = async ({ cookies }) => {
    const signed_in = await auth.validateCookies(cookies);
    if (signed_in) throw redirect(302, '/');
};
