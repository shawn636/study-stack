<script lang="ts">
    import Fa from 'svelte-fa';
    import { faGoogle, faFacebook, faApple } from '@fortawesome/free-brands-svg-icons';
    import {
        faChevronLeft,
        faCircleExclamation,
        faEye,
        faEyeSlash,
        faExclamationTriangle,
        faCircleCheck
    } from '@fortawesome/free-solid-svg-icons';
    import { fly, slide } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import { createForm } from 'svelte-forms-lib';
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { goto } from '$app/navigation';
    import { registrationForm } from './registration-form-schema';

    // Controls
    let showPassword1 = false;
    let showPassword2 = false;

    const toggleShow1 = () => {
        showPassword1 = !showPassword1;
    };

    const toggleShow2 = () => {
        showPassword2 = !showPassword2;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            nextForm();
        }
    };

    // Form Validation
    const { form, errors, validateField, touched, handleChange, handleSubmit } = createForm({
        initialValues: {
            name: '',
            email: '',
            password1: '',
            password2: ''
        },
        validationSchema: registrationForm,
        onSubmit: async (values) => {
            validateField('name');
            validateField('email');
            validateField('password1');
            validateField('password2');
            if ($errors.name || $errors.email || $errors.password1 || $errors.password2) {
                return;
            }
            isSubmitting = true;
            submissionError = null;
            const res = await submitForm(values);
            isSubmitting = false;

            if (res) {
                const data = await res.json();

                if (res?.status == 200) {
                    showSuccess = true;
                    await new Promise<void>((resolve) => setTimeout(resolve, 600));
                    goto('/');
                } else {
                    console.log(data.error.message);
                    if (data.error.message.includes('already in use')) {
                        prevFormIndex = currFormIndex;
                        currFormIndex = 0;
                        $errors.email = 'This email is already in use.';
                    } else if (data.error.message.includes('data provided is invalid')) {
                        submissionError =
                            'It looks like the data you provided is invalid. Please try again.';
                    } else {
                        submissionError = 'An unknown error occurred. Please try again.';
                    }
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
            name: string;
            email: string;
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
                method: 'POST',
                body: formData
            });

            return res;
        }

        return null;
    };

    // Form Transitions
    const transitionDuration = 300;
    const formCount = 2;

    let currFormIndex = 0;
    let prevFormIndex = 0; // to determine transition animation dir

    $: transitionTo = currFormIndex > prevFormIndex ? 'right' : 'left';

    const nextForm = () => {
        validateField('name');
        validateField('email');
        if (!$touched.name) {
            $errors.name = 'Please enter your name.';
        }
        if (!$touched.email) {
            $errors.email = 'Please enter your email address.';
        }

        if (!$errors.name && !$errors.email && currFormIndex < formCount - 1) {
            prevFormIndex = currFormIndex;
            currFormIndex++;
        }
    };

    const prevForm = () => {
        if (currFormIndex > 0) {
            prevFormIndex = currFormIndex;
            currFormIndex--;
        }
    };
</script>

<form
    class="items-center w-full h-full grid"
    id="register-form"
    on:submit={handleSubmit}
    data-test-id="sign-up-form"
>
    {#if currFormIndex == 0}
        <div
            class="items-center h-full grid justify-items-center row-start-1 row-end-2 col-start-1 col-end-2"
            id="main"
            in:fly|global={{
                x: transitionTo === 'right' ? '100%' : '-100%',
                duration: transitionDuration,
                delay: transitionDuration,
                easing: cubicInOut
            }}
            out:fly|global={{
                x: transitionTo === 'right' ? '-100%' : '100%',
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
                        <div class="pb-5">
                            <h2 class="font-semibold h2">Welcome to Equipped</h2>
                            <p class="mt-4 text-xs text-slate-500">
                                Please enter your details below
                            </p>
                        </div>

                        <div class="grid grid-flow-row text-md gap-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    class="input
                                        {$errors.name ? 'border-error-500' : ''}
                                        {!$errors.name && $touched.name
                                        ? 'border-success-700'
                                        : ''}"
                                    on:change={handleChange}
                                    on:blur={handleChange}
                                    bind:value={$form.name}
                                    on:keydown={handleKeyDown}
                                />
                                {#if $errors.name}
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
                                            size="16"
                                            class="text-error-500"
                                        />
                                        <small class="text-error-500">{$errors.name}</small>
                                    </div>
                                {/if}
                            </div>

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                on:change={handleChange}
                                on:blur={handleChange}
                                bind:value={$form.email}
                                on:keydown={handleKeyDown}
                                class="input
                                        {$errors.email ? 'border-error-500' : ''}
                                        {!$errors.email && $touched.name
                                    ? 'border-success-700'
                                    : ''}"
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
                                        size="16"
                                        class="text-error-500"
                                    />
                                    <small class="text-error-500">{$errors.email}</small>
                                </div>
                            {/if}
                            <button
                                type="button"
                                aria-label="continue"
                                on:click={nextForm}
                                class="font-medium btn variant-filled-secondary">Continue</button
                            >
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
                                aria-label="Sign up with Google"
                            >
                                <Fa icon={faGoogle} size="20" />
                                <span>Sign up with Google</span>
                            </button>

                            <button
                                disabled
                                type="button"
                                class="btn variant-soft"
                                aria-label="Sign up with Facebook"
                            >
                                <Fa icon={faFacebook} size="20" />
                                <span>Sign up with Facebook</span>
                            </button>

                            <button
                                disabled
                                type="button"
                                class="btn variant-soft"
                                aria-label="Sign up with Apple"
                            >
                                <Fa icon={faApple} size="20" />
                                <span>Sign up with Apple</span>
                            </button>
                        </div>
                        <p class="py-2 text-sm text-slate-500">
                            Already have an account? <a
                                class="font-semibold text-primary-500 hover:text-primary-600"
                                href="/auth/login">Sign in</a
                            >
                        </p>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div
            class="items-center h-full grid justify-items-center row-start-1 row-end-2 col-start-1 col-end-2"
            in:fly|global={{
                x: transitionTo === 'right' ? '100%' : '-100%',
                duration: transitionDuration,
                delay: transitionDuration,
                easing: cubicInOut
            }}
            out:fly|global={{
                x: transitionTo === 'right' ? '-100%' : '100%',
                duration: transitionDuration,
                easing: cubicInOut
            }}
        >
            <div class="grid grid-items-center">
                <a
                    href="/"
                    class="flex items-center justify-start p-1 text-center btn btn-iconn text-surface-700 dark:text-surface-300 gap-1"
                >
                    <Fa icon={faChevronLeft} />
                    Home
                </a>
                <div class="card shadow-lg p-10 w-[360px] grid justify-items-center">
                    <!-- Header -->
                    <div class="py-5">
                        <h2 class="font-semibold text-center h2">Choose a password</h2>
                    </div>
                    <!-- Form 2 -->
                    <div class="w-full grid grid-flow-row text-md gap-y-4 justify-items-stretch">
                        {#if showPassword1}
                            <div class="flex">
                                <input
                                    type="text"
                                    name="password1"
                                    placeholder="Enter a password"
                                    on:change={handleChange}
                                    on:blur={handleChange}
                                    bind:value={$form.password1}
                                    class="rounded-r-none input"
                                    required
                                />
                                <button
                                    aria-label="Toggle password visibility"
                                    type="button"
                                    on:click={toggleShow1}
                                    class="rounded-l-none rounded-r-lg btn-icon variant-filled-primary"
                                    ><Fa icon={faEyeSlash} size="16" /></button
                                >
                            </div>
                        {:else}
                            <div class="flex">
                                <input
                                    type="password"
                                    name="password1"
                                    placeholder="Enter a password"
                                    on:change={handleChange}
                                    on:blur={handleChange}
                                    bind:value={$form.password1}
                                    class="rounded-r-none input"
                                    required
                                />
                                <button
                                    aria-label="Toggle password visibility"
                                    type="button"
                                    on:click={toggleShow1}
                                    class="rounded-l-none rounded-r-lg btn-icon variant-filled-primary"
                                    ><Fa icon={faEye} size="16" /></button
                                >
                            </div>
                        {/if}
                        {#if $errors.password1}
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
                                <Fa icon={faCircleExclamation} size="16" class="text-error-500" />
                                <small class="text-error-500">{$errors.password1}</small>
                            </div>
                        {/if}
                        {#if showPassword2}
                            <div class="flex">
                                <input
                                    type="text"
                                    name="password2"
                                    placeholder="Enter a password"
                                    on:change={handleChange}
                                    on:blur={handleChange}
                                    bind:value={$form.password2}
                                    class="rounded-r-none input"
                                    required
                                />
                                <button
                                    aria-label="Toggle password confirmation visibility"
                                    type="button"
                                    on:click={toggleShow2}
                                    class="rounded-l-none rounded-r-lg btn-icon variant-filled-primary"
                                    ><Fa icon={faEyeSlash} size="16" /></button
                                >
                            </div>
                        {:else}
                            <div class="flex">
                                <input
                                    type="password"
                                    name="password2"
                                    placeholder="Enter a password"
                                    on:change={handleChange}
                                    on:blur={handleChange}
                                    bind:value={$form.password2}
                                    class="rounded-r-none input"
                                    required
                                />
                                <button
                                    aria-label="Toggle password confirmation visibility"
                                    type="button"
                                    on:click={toggleShow2}
                                    class="rounded-l-none rounded-r-lg btn-icon variant-filled-primary"
                                    ><Fa icon={faEye} size="16" /></button
                                >
                            </div>
                        {/if}
                        {#if $errors.password2}
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
                                <Fa icon={faCircleExclamation} size="16" class="text-error-500" />
                                <small class="text-error-500">{$errors.password2}</small>
                            </div>
                        {/if}
                        <button
                            aria-label="Submit form"
                            type="submit"
                            class="flex font-medium btn variant-filled-secondary gap-2"
                        >
                            {#if isSubmitting}
                                <ProgressRadial width="w-6" stroke={100} />
                            {:else}
                                Submit
                            {/if}
                        </button>
                        <button
                            aria-label="Go back"
                            type="button"
                            on:click={prevForm}
                            class="font-medium btn variant-filled-surface">Go Back</button
                        >
                    </div>
                </div>
                {#if submissionError}
                    <div
                        class="alert variant-ghost-error mt-4 items-center w-[360px]"
                        in:slide={{
                            duration: 300,
                            easing: cubicInOut
                        }}
                        out:slide={{
                            duration: 300,
                            easing: cubicInOut
                        }}
                    >
                        <div class="grid grid-cols-[auto_1fr] gap-x-4 w-ful h-full items-center">
                            <Fa
                                icon={faExclamationTriangle}
                                size="16"
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
                        class="alert variant-ghost-success mt-4 w-[360px]"
                        in:slide={{
                            duration: 300,
                            easing: cubicInOut
                        }}
                        out:slide={{
                            duration: 300,
                            easing: cubicInOut
                        }}
                    >
                        <div class="grid grid-cols-[auto_1fr] gap-x-4 w-ful h-full items-center">
                            <Fa icon={faCircleCheck} />
                            <div class="alert-message">
                                <p>Account created successfully</p>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</form>
