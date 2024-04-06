<script lang="ts">
    import { goto } from '$app/navigation';
    import FormError from '$lib/components/form-error.svelte';
    import SubmissionError from '$lib/components/submission-error.svelte';
    import { type ContactForm, contactForm } from '$lib/models/forms/contact';
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { onMount } from 'svelte';
    import { createForm } from 'svelte-forms-lib';

    import type { PageServerData } from './$types';

    let showSuccess = false;
    let isSubmitting = false;
    let submissionError: null | string = null;

    export let data: PageServerData;

    let messageInput: HTMLTextAreaElement;

    onMount(() => {
        if (data.user) {
            messageInput.focus();
        }
    });

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

            if (response && response.ok) {
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
            const formData = new FormData();
            formData.append('email', form.email);
            formData.append('message', form.message);
            if (form.name) {
                formData.append('name', form.name);
            }
            return await fetch('/api/contact', {
                body: formData,
                method: 'POST'
            });
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
    <h3 class="h3 text-center font-bold text-primary-700">Contact Us</h3>
    <p class="text-center">Have a question? We're here to help!</p>

    <form
        class="mt-10 grid grid-flow-row grid-cols-2 gap-8"
        id="contact-form"
        on:submit={handleSubmit}
    >
        <div>
            <label aria-hidden class="label hidden" for="name">Name</label>
            <input
                bind:value={$form.name}
                class={nameClass}
                id="name-input"
                name="name"
                on:blur={handleChange}
                on:change={handleChange}
                placeholder="Name"
                tabindex="0"
                type="text"
            />
            <FormError bind:error={$errors.name} />
        </div>

        <div>
            <label aria-hidden class="label hidden" for="email">Email</label>
            <input
                bind:value={$form.email}
                class={emailClass}
                id="email-input"
                name="email"
                on:blur={handleChange}
                on:change={handleChange}
                placeholder="Email"
                tabindex="0"
                type="email"
            />
            <FormError bind:error={$errors.email} />
        </div>

        <div class="col-span-2">
            <label aria-hidden class="label hidden" for="message">Message</label>
            <textarea
                bind:this={messageInput}
                bind:value={$form.message}
                class={messageClass}
                id="message"
                name="message"
                on:blur={handleChange}
                on:change={handleChange}
                placeholder="Message"
                tabindex="0"
            />
            <FormError bind:error={$errors.message} />
        </div>

        <div class="col-span-2 grid grid-flow-row justify-items-center">
            <button
                class="variant-filled-primary btn w-40 font-medium text-white"
                tabindex="0"
                type="submit"
            >
                {#if isSubmitting}
                    <ProgressRadial stroke={100} width="w-6" />
                {:else}
                    Send
                {/if}
            </button>
            <SubmissionError
                {showSuccess}
                {submissionError}
                successMessage="Thanks for reaching out! We will get back to you as soon as possible."
            />
        </div>
    </form>
</div>
