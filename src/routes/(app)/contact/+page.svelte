<script lang="ts">
    import { type ContactForm, contactForm } from '$lib/models/forms/contact';

    import { Button } from '$lib/components/ui/button';
    import { apiClientSingleton as client } from '$lib/api';
    import { createForm } from 'svelte-forms-lib';
    import Fa from 'svelte-fa';
    import { faSpinner } from '@fortawesome/free-solid-svg-icons';
    import FormError from '$lib/components/form-error.svelte';
    import { goto } from '$app/navigation';
    import { Input } from '$lib/components/ui/input';
    import type { PageServerData } from './$types';
    import SubmissionError from '$lib/components/submission-error.svelte';
    import { Textarea } from '$lib/components/ui/textarea';

    let showSuccess = false;
    let isSubmitting = false;
    let submissionError: string | null = null;

    export let data: PageServerData;

    const { errors, form, handleChange, handleSubmit, touched, validateField } = createForm({
        initialValues: {
            email: data.user?.email ?? '',
            message: '',
            name: data.user?.name ?? ''
        },
        onSubmit: async (values) => {
            validateField('email');
            validateField('name');
            validateField('message');
            isSubmitting = true;
            submissionError = null;
            const response = await submitForm(values);
            isSubmitting = false;

            if (response && response.success) {
                showSuccess = true;
                await new Promise<void>((resolve) => setTimeout(resolve, 3000));
                goto('/');
            } else {
                submissionError = 'An error occurred while submitting the form. Please try again.';
            }
        },
        validationSchema: contactForm
    });

    const submitForm = async (form?: ContactForm) => {
        if (form) {
            try {
                const response = await client.contactMessages.create(form);
                return response;
            } catch (error) {
                return { success: false };
            }
        }
        return null;
    };

    $: emailClass = `input ${$errors.email ? 'border-error-500' : ''} 
        ${!$errors.email && $touched.email ? 'border-success-700' : ''}
    `;

    $: nameClass = `input ${$errors.name ? 'border-error-500' : ''} 
        ${!$errors.name && $touched.name ? 'border-success-700' : ''}
    `;

    $: messageClass = `input min-h-16
        ${$errors.message ? 'border-error-500' : ''} 
        ${!$errors.message && $touched.message ? 'border-success-700' : ''}
    `;
</script>

<div class="card mx-auto my-20 max-w-2xl p-8">
    <h3 class="h3 text-primary-700 text-center font-bold">Contact Us</h3>
    <p class="text-center">Have a question? We're here to help!</p>

    <form
        class="mt-10 grid grid-flow-row grid-cols-2 gap-8"
        id="contact-form"
        on:submit={handleSubmit}
    >
        <div>
            <label aria-hidden class="label hidden" for="name">Name</label>
            <Input
                bind:value={$form.name}
                class={nameClass}
                id="name-input"
                name="name"
                on:blur={handleChange}
                on:change={handleChange}
                placeholder="Name"
                type="text"
            />
            <FormError bind:error={$errors.name} />
        </div>

        <div>
            <label aria-hidden class="label hidden" for="email">Email</label>
            <Input
                bind:value={$form.email}
                class={emailClass}
                id="email-input"
                name="email"
                on:blur={handleChange}
                on:change={handleChange}
                placeholder="Email"
                type="email"
            />
            <FormError bind:error={$errors.email} />
        </div>

        <div class="col-span-2">
            <label aria-hidden class="label hidden" for="message">Message</label>
            <Textarea
                bind:value={$form.message}
                class={messageClass}
                id="message"
                name="message"
                on:blur={handleChange}
                on:change={handleChange}
                placeholder="Message"
            />
            <FormError bind:error={$errors.message} />
        </div>

        <div class="col-span-2 grid grid-flow-row justify-items-center">
            <Button class="w-40 font-medium" type="submit">
                {#if isSubmitting}
                    <Fa class="animate-spin" icon={faSpinner} />
                {:else}
                    Send
                {/if}
            </Button>
            <SubmissionError
                {showSuccess}
                {submissionError}
                successMessage="Thanks for reaching out! We will get back to you as soon as possible."
            />
        </div>
    </form>
</div>
