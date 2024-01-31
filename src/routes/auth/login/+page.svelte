<script lang="ts">
    import Fa from 'svelte-fa';
    import { faGoogle, faFacebook, faApple } from '@fortawesome/free-brands-svg-icons';
    import {
        faChevronLeft,
        faCircleExclamation,
        faExclamationTriangle,
        faCircleCheck
    } from '@fortawesome/free-solid-svg-icons';
    import { fly, slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { createForm } from 'svelte-forms-lib';
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { goto } from '$app/navigation';
    import { loginForm } from './login-form-schema';

    // Form Validation
    const { form, errors, validateField, touched, handleChange, handleSubmit } = createForm({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: loginForm,
        onSubmit: async (values) => {
            validateField('email');
            validateField('password');

            isSubmitting = true;
            submissionError = null;
            const res = await submitForm(values);
            isSubmitting = false;

            if (res) {
                const data = await res.json();

                if (res?.status == 200) {
                    showSuccess = true;
                    goto('/');
                } else {
                    if (data.error.message.includes('Invalid credentials')) {
                        submissionError = 'The email or password you entered is incorrect.';
                    }
                    submissionError = data.error.message;
                    console.log(data.error.message);
                }
            } else {
                submissionError = 'An error occurred. Please try again.';
            }
        }
    });

    let showSuccess = false;
    let isSubmitting = false;
    let submissionError: string | null = null;

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
                method: 'POST',
                body: formData
            });

            return res;
        }

        return null;
    };

    // Form Transitions
    const transitionDuration = 300;
</script>

<form
    class="items-center w-full h-full grid"
    id="register-form"
    on:submit={handleSubmit}
    data-test-id="sign-in-form"
>
    <div
        class="items-center h-full grid justify-items-center row-start-1 row-end-2 col-start-1 col-end-2"
        id="main"
        in:fly|global={{
            x: '100%',
            duration: transitionDuration,
            delay: transitionDuration,
            easing: cubicInOut
        }}
        out:fly|global={{
            x: '-100%',
            duration: transitionDuration,
            easing: cubicInOut
        }}
    >
        <div class="items-center grid">
            <a
                href="/"
                class="flex items-center justify-start p-1 text-center btn btn-iconn text-surface-700 dark:text-surface-300 gap-1"
            >
                <Fa icon={faChevronLeft} />
                Home
            </a>
            <div class="card shadow-lg p-10 w-[360px] grid justify-items-center">
                <div class="text-center">
                    <!-- Header -->
                    <div class="py-5">
                        <h2 class="font-semibold h2">Welcome</h2>
                        <p class="my-2 text-xs text-slate-500">Please enter your details below</p>
                    </div>

                    <div class="grid grid-flow-row text-md gap-y-4">
                        <div>
                            <input
                                type="email"
                                tabindex="0"
                                name="email"
                                placeholder="Email"
                                class="input
                                        {$errors.email ? 'border-error-500' : ''}
                                        {!$errors.email && $touched.email
                                    ? 'border-success-700'
                                    : ''}"
                                on:change={handleChange}
                                on:blur={handleChange}
                                bind:value={$form.email}
                            />
                            {#if $errors.email}
                                <div
                                    class="flex items-center gap-x-1"
                                    in:slide={{
                                        duration: 300,
                                        easing: cubicInOut
                                    }}
                                    out:slide={{
                                        duration: 300,
                                        easing: cubicInOut
                                    }}
                                >
                                    <Fa
                                        icon={faCircleExclamation}
                                        size="sm"
                                        class="text-error-500"
                                    />
                                    <small class="text-error-500">{$errors.email}</small>
                                </div>
                            {/if}
                        </div>

                        <input
                            type="password"
                            tabindex="0"
                            name="password"
                            placeholder="Password"
                            on:change={handleChange}
                            on:blur={handleChange}
                            bind:value={$form.password}
                            class="input
                                        {$errors.password ? 'border-error-500' : ''}
                                        {!$errors.password && $touched.password
                                ? 'border-success-700'
                                : ''}"
                        />
                        {#if $errors.password}
                            <div
                                class="flex items-center gap-x-1"
                                in:slide={{
                                    duration: 300,
                                    easing: cubicInOut
                                }}
                                out:slide={{
                                    duration: 300,
                                    easing: cubicInOut
                                }}
                            >
                                <Fa icon={faCircleExclamation} size="sm" class="text-error-500" />
                                <small class="text-error-500">{$errors.password}</small>
                            </div>
                        {/if}
                        <button
                            type="submit"
                            tabindex="0"
                            aria-label="continue"
                            class="font-medium btn variant-filled-secondary"
                        >
                            {#if isSubmitting}
                                <ProgressRadial width="w-6" stroke={100} />
                            {:else}
                                Submit
                            {/if}
                        </button>
                        {#if submissionError}
                            <div
                                class="items-center mt-4 alert variant-ghost-error"
                                in:slide={{
                                    duration: 300,
                                    easing: cubicInOut
                                }}
                                out:slide={{
                                    duration: 300,
                                    easing: cubicInOut
                                }}
                            >
                                <div
                                    class="grid grid-cols-[auto_1fr] gap-x-4 w-ful h-full items-center"
                                >
                                    <Fa
                                        icon={faExclamationTriangle}
                                        size="sm"
                                        class="row-start-1 row-end-2 col-start-1 col-end-2"
                                    />
                                    <div
                                        class="items-center alert-message grid h-fullrow-start-1 row-end-2 col-start-2 col-end-3"
                                    >
                                        <p>{submissionError}</p>
                                    </div>
                                </div>
                            </div>
                        {/if}
                        {#if showSuccess}
                            <div
                                class="mt-4 alert variant-ghost-success"
                                in:slide={{
                                    duration: 300,
                                    easing: cubicInOut
                                }}
                                out:slide={{
                                    duration: 300,
                                    easing: cubicInOut
                                }}
                            >
                                <div
                                    class="items-center text-center alert-message grid grid-flow-col gap-x-2"
                                >
                                    <Fa icon={faCircleCheck} />
                                    <p class="pb-1">Login Successful</p>
                                </div>
                            </div>
                        {/if}
                    </div>

                    <!-- Divider -->

                    <div class="grid grid-cols-[1fr_auto_1fr] items-center py-5">
                        <hr />
                        <p
                            class="px-2 text-sm font-semibold uppercase text-surface-500 dark:text-surface-400"
                        >
                            or
                        </p>
                        <hr />
                    </div>

                    <!-- OAuth Buttons -->
                    <div class="grid grid-flow-row gap-y-3">
                        <button
                            disabled
                            type="button"
                            class="btn variant-soft"
                            aria-label="Sign in with Google"
                        >
                            <Fa icon={faGoogle} size="lg" />
                            <span>Sign in with Google</span>
                        </button>

                        <button
                            disabled
                            type="button"
                            class="btn variant-soft"
                            aria-label="Sign in with Facebook"
                        >
                            <Fa icon={faFacebook} size="lg" />
                            <span>Sign in with Facebook</span>
                        </button>

                        <button
                            disabled
                            type="button"
                            class="btn variant-soft"
                            aria-label="Sign in with Apple"
                        >
                            <Fa icon={faApple} size="lg" />
                            <span>Sign in with Apple</span>
                        </button>
                    </div>
                    <p class="py-2 text-sm text-slate-500">
                        Don't have an account? <a
                            class="font-semibold text-primary-500 hover:text-primary-600"
                            href="/auth/register">Sign up</a
                        >
                    </p>
                </div>
            </div>
        </div>
    </div>
</form>
