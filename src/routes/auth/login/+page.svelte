<script lang="ts">
    import { goto } from '$app/navigation';
    import { faApple, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
    import {
        faChevronLeft,
        faCircleCheck,
        faCircleExclamation,
        faExclamationTriangle
    } from '@fortawesome/free-solid-svg-icons';
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { cubicInOut } from 'svelte/easing';
    import { fly, slide } from 'svelte/transition';
    import Fa from 'svelte-fa';
    import { createForm } from 'svelte-forms-lib';

    import { loginForm } from './login-form-schema';

    // Form Validation
    const { errors, form, handleChange, handleSubmit, touched, validateField } = createForm({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: async (values) => {
            validateField('email');
            validateField('password');

            isSubmitting = true;
            submissionError = null;
            const res = await submitForm(values);
            isSubmitting = false;

            if (res) {
                const data = await res.json();

                if (res?.status === 200) {
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
        },
        validationSchema: loginForm
    });

    let showSuccess = false;
    let isSubmitting = false;
    let submissionError: null | string = null;

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

    // Form Transitions
    const transitionDuration = 300;
</script>

<form
    class="grid h-full w-full items-center"
    data-test-id="sign-in-form"
    id="register-form"
    on:submit={handleSubmit}
>
    <div
        class="col-start-1 col-end-2 row-start-1 row-end-2 grid h-full items-center justify-items-center"
        id="main"
        in:fly|global={{
            delay: transitionDuration,
            duration: transitionDuration,
            easing: cubicInOut,
            x: '100%'
        }}
        out:fly|global={{
            duration: transitionDuration,
            easing: cubicInOut,
            x: '-100%'
        }}
    >
        <div class="grid items-center">
            <a
                class="btn-iconn btn flex items-center justify-start gap-1 p-1 text-center text-surface-700 dark:text-surface-300"
                href="/"
            >
                <Fa icon={faChevronLeft} />
                Home
            </a>
            <div class="card grid w-[360px] justify-items-center p-10 shadow-lg">
                <div class="text-center">
                    <!-- Header -->
                    <div class="py-5">
                        <h2 class="h2 font-semibold">Welcome</h2>
                        <p class="my-2 text-xs text-slate-500">Please enter your details below</p>
                    </div>

                    <div class="text-md grid grid-flow-row gap-y-4">
                        <div>
                            <input
                                bind:value={$form.email}
                                class="input
                                        {$errors.email ? 'border-error-500' : ''}
                                        {!$errors.email && $touched.email
                                    ? 'border-success-700'
                                    : ''}"
                                name="email"
                                on:blur={handleChange}
                                on:change={handleChange}
                                placeholder="Email"
                                tabindex="0"
                                type="email"
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
                                        class="text-error-500"
                                        icon={faCircleExclamation}
                                        size="sm"
                                    />
                                    <small class="text-error-500">{$errors.email}</small>
                                </div>
                            {/if}
                        </div>

                        <input
                            bind:value={$form.password}
                            class="input
                                        {$errors.password ? 'border-error-500' : ''}
                                        {!$errors.password && $touched.password
                                ? 'border-success-700'
                                : ''}"
                            name="password"
                            on:blur={handleChange}
                            on:change={handleChange}
                            placeholder="Password"
                            tabindex="0"
                            type="password"
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
                                <Fa class="text-error-500" icon={faCircleExclamation} size="sm" />
                                <small class="text-error-500">{$errors.password}</small>
                            </div>
                        {/if}
                        <button
                            aria-label="continue"
                            class="variant-filled-secondary btn font-medium"
                            tabindex="0"
                            type="submit"
                        >
                            {#if isSubmitting}
                                <ProgressRadial stroke={100} width="w-6" />
                            {:else}
                                Submit
                            {/if}
                        </button>
                        {#if submissionError}
                            <div
                                class="alert variant-ghost-error mt-4 items-center"
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
                                    class="w-ful grid h-full grid-cols-[auto_1fr] items-center gap-x-4"
                                >
                                    <Fa
                                        class="col-start-1 col-end-2 row-start-1 row-end-2"
                                        icon={faExclamationTriangle}
                                        size="sm"
                                    />
                                    <div
                                        class="h-fullrow-start-1 alert-message col-start-2 col-end-3 row-end-2 grid items-center"
                                    >
                                        <p>{submissionError}</p>
                                    </div>
                                </div>
                            </div>
                        {/if}
                        {#if showSuccess}
                            <div
                                class="alert variant-ghost-success mt-4"
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
                                    class="alert-message grid grid-flow-col items-center gap-x-2 text-center"
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
                            aria-label="Sign in with Google"
                            class="variant-soft btn"
                            disabled
                            type="button"
                        >
                            <Fa icon={faGoogle} size="lg" />
                            <span>Sign in with Google</span>
                        </button>

                        <button
                            aria-label="Sign in with Facebook"
                            class="variant-soft btn"
                            disabled
                            type="button"
                        >
                            <Fa icon={faFacebook} size="lg" />
                            <span>Sign in with Facebook</span>
                        </button>

                        <button
                            aria-label="Sign in with Apple"
                            class="variant-soft btn"
                            disabled
                            type="button"
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
