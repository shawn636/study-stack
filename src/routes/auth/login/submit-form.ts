import { goto } from '$app/navigation';
import { loginForm } from '$lib/models/forms/login';
import { createForm as createSvelteForm } from 'svelte-forms-lib';
import { toast } from 'svelte-sonner';

import { submissionError, submissionState } from './submission-stores';

const submitForm = async (
    values: {
        email: string;
        password: string;
    } | null
) => {
    if (values) {
        const formData = new FormData();
        formData.append('email', values.email);
        formData.append('password', values.password);

        const res = await fetch('/auth/login', {
            body: formData,
            method: 'POST'
        });

        return res;
    }

    return null;
};

export const createForm = () => {
    const result = createSvelteForm({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: async (values) => {
            result.validateField('email');
            result.validateField('password');

            submissionState.set('submitting');
            submissionError.set(null);
            const res = await submitForm(values);

            if (res) {
                const data = await res.json();

                if (res?.status === 200) {
                    submissionState.set('idle');
                    toast.success('You have successfully logged in.');
                    goto('/');
                } else {
                    submissionState.set('error');
                    if (data.error.message.includes('Invalid credentials')) {
                        toast.error('The email or password you entered is incorrect.');
                        submissionError.set('The email or password you entered is incorrect.');
                    } else {
                        toast.error('An error occurred. Please try again.');
                        submissionError.set(data.error.message);
                    }
                }
            } else {
                toast.error('An error occurred. Please try again.');
                submissionError.set('An error occurred. Please try again.');
            }
        },
        validationSchema: loginForm
    });

    return result;
};
