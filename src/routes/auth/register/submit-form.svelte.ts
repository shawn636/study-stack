import { createForm as createSvelteForm } from 'svelte-forms-lib';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { registrationForm } from '$lib/models/forms/registration';
import { toast } from 'svelte-sonner';

type SubmissionState = 'error' | 'idle' | 'submitting';

export const submissionState = $state<{ value: SubmissionState }>({ value: 'idle' });
export const submissionError = $state<{ value: string | null }>({ value: null });

const submitForm = async (
    values: {
        email: string;
        name: string;
        password1: string;
        password2: string;
    } | null
) => {
    if (values) {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('password1', values.password1);
        formData.append('password2', values.password2);

        const res = await fetch('/auth/register', {
            body: formData,
            method: 'POST'
        });

        return res;
    }

    return null;
};

export const createForm = () => {
    const currentPage = get(page);
    const redirectPath = currentPage.url.searchParams.get('redirect') ?? '/';
    const result = createSvelteForm({
        initialValues: {
            email: '',
            name: '',
            password1: '',
            password2: ''
        },
        onSubmit: async (values) => {
            result.validateField('name');
            result.validateField('email');
            result.validateField('password1');
            result.validateField('password2');

            submissionState.value = 'submitting';
            submissionError.value = null;
            const res = await submitForm(values);

            if (res) {
                const data = await res.json();

                if (res?.status === 200) {
                    submissionState.value = 'idle';
                    toast.success('Account created successfully');
                    goto(redirectPath);
                } else {
                    submissionState.value = 'error';
                    if (data.error.message.includes('already in use')) {
                        submissionError.value = 'This email is already in use.';
                        toast.error('This email is already in use.');
                    } else if (data.error.message.includes('data provided is invalid')) {
                        submissionError.value =
                            'It looks like the data you provided is invalid. Please try again.';
                        toast.error(
                            'It looks like the data you provided is invalid. Please try again.'
                        );
                    } else {
                        submissionError.value = 'An unknown error occurred. Please try again.';
                        toast.error('An unknown error occurred. Please try again.');
                    }
                }
            } else {
                submissionError.value = 'An error occurred. Please try again.';
                toast.error('An error occurred. Please try again.');
            }
        },
        validationSchema: registrationForm
    });

    return result;
};
