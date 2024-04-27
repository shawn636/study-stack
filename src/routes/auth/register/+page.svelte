<script lang="ts">
    import { goto } from '$app/navigation';
    import { registrationForm } from '$lib/models/forms/registration';
    import { faApple, faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
    import {
        faChevronLeft,
        faCircleCheck,
        faCircleExclamation,
        faExclamationTriangle,
        faEye,
        faEyeSlash
    } from '@fortawesome/free-solid-svg-icons';
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { cubicInOut } from 'svelte/easing';
    import { fly, slide } from 'svelte/transition';
    import Fa from 'svelte-fa';
    import { createForm } from 'svelte-forms-lib';

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
            (event.target as HTMLInputElement).blur();
            nextForm();
        }
    };

    // Form Validation
    const { errors, form, handleChange, handleSubmit, touched, validateField } = createForm({
        initialValues: {
            email: '',
            name: '',
            password1: '',
            password2: ''
        },
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

                if (res?.status === 200) {
                    showSuccess = true;
                    await new Promise<void>((resolve) => setTimeout(resolve, 600));
                    goto('/');
                } else {
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
        },
        validationSchema: registrationForm
    });

    let showSuccess = false;
    let isSubmitting = false;
    let submissionError: null | string = null;

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
    class="grid h-full w-full items-center"
    data-testid="sign-up-form"
    id="register-form"
    on:submit={handleSubmit}
>
    {#if currFormIndex === 0}
        <div
            class="col-start-1 col-end-2 row-start-1 row-end-2 grid h-full items-center justify-items-center"
            id="main"
            in:fly|global={{
                delay: transitionDuration,
                duration: transitionDuration,
                easing: cubicInOut,
                x: transitionTo === 'right' ? '100%' : '-100%'
            }}
            out:fly|global={{
                duration: transitionDuration,
                easing: cubicInOut,
                x: transitionTo === 'right' ? '-100%' : '100%'
            }}
        >
            <div class="grid items-center">
                <a
                    class="btn-iconn btn flex items-center justify-start gap-1 p-1 text-center text-surface-700 dark:text-surface-300"
                    href="/"
                    tabindex="0"
                >
                    <Fa icon={faChevronLeft} />
                    Home
                </a>
                <div class="card grid w-[360px] justify-items-center p-10 shadow-lg">
                    <div class="text-center">
                        <!-- Header -->
                        <div class="pb-5">
                            <h2 class="h2 font-semibold">Welcome to Equipped</h2>
                            <p class="mt-4 text-xs text-slate-500">
                                Please enter your details below
                            </p>
                        </div>

                        <div class="text-md grid grid-flow-row gap-y-4">
                            <div>
                                <input
                                    bind:value={$form.name}
                                    class="input
                                        {$errors.name ? 'border-error-500' : ''}
                                        {!$errors.name && $touched.name
                                        ? 'border-success-700'
                                        : ''}"
                                    name="name"
                                    on:blur={handleChange}
                                    on:change={handleChange}
                                    on:keydown={handleKeyDown}
                                    placeholder="Name"
                                    tabindex="0"
                                    type="text"
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
                                            class="text-error-500"
                                            icon={faCircleExclamation}
                                            size="sm"
                                        />
                                        <small class="text-error-500">{$errors.name}</small>
                                    </div>
                                {/if}
                            </div>

                            <input
                                bind:value={$form.email}
                                class="input
                                        {$errors.email ? 'border-error-500' : ''}
                                        {!$errors.email && $touched.name
                                    ? 'border-success-700'
                                    : ''}"
                                name="email"
                                on:blur={handleChange}
                                on:change={handleChange}
                                on:keydown={handleKeyDown}
                                placeholder="Email"
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
                            <button
                                aria-label="continue"
                                class="variant-filled-secondary btn font-medium"
                                on:click={nextForm}
                                tabindex="0"
                                type="button">Continue</button
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
                                aria-label="Sign up with Google"
                                class="variant-soft btn"
                                disabled
                                type="button"
                            >
                                <Fa icon={faGoogle} size="lg" />
                                <span>Sign up with Google</span>
                            </button>

                            <button
                                aria-label="Sign up with Facebook"
                                class="variant-soft btn"
                                disabled
                                type="button"
                            >
                                <Fa icon={faFacebook} size="lg" />
                                <span>Sign up with Facebook</span>
                            </button>

                            <button
                                aria-label="Sign up with Apple"
                                class="variant-soft btn"
                                disabled
                                type="button"
                            >
                                <Fa icon={faApple} size="lg" />
                                <span>Sign up with Apple</span>
                            </button>
                        </div>
                        <p class="py-2 text-sm text-slate-500">
                            Already have an account? <a
                                class="font-semibold text-primary-500 hover:text-primary-600"
                                href="/auth/login"
                                tabindex="0">Sign in</a
                            >
                        </p>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div
            class="col-start-1 col-end-2 row-start-1 row-end-2 grid h-full items-center justify-items-center"
            in:fly|global={{
                delay: transitionDuration,
                duration: transitionDuration,
                easing: cubicInOut,
                x: transitionTo === 'right' ? '100%' : '-100%'
            }}
            out:fly|global={{
                duration: transitionDuration,
                easing: cubicInOut,
                x: transitionTo === 'right' ? '-100%' : '100%'
            }}
        >
            <div class="grid-items-center grid">
                <a
                    class="btn-iconn btn flex items-center justify-start gap-1 p-1 text-center text-surface-700 dark:text-surface-300"
                    href="/"
                    tabindex="0"
                >
                    <Fa icon={faChevronLeft} />
                    Home
                </a>
                <div class="card grid w-[360px] justify-items-center p-10 shadow-lg">
                    <!-- Header -->
                    <div class="py-5">
                        <h2 class="h2 text-center font-semibold">Choose a password</h2>
                    </div>
                    <!-- Form 2 -->
                    <div class="text-md grid w-full grid-flow-row justify-items-stretch gap-y-4">
                        {#if showPassword1}
                            <div class="flex">
                                <input
                                    bind:value={$form.password1}
                                    class="input rounded-r-none"
                                    name="password1"
                                    on:blur={handleChange}
                                    on:change={handleChange}
                                    placeholder="Enter a password"
                                    required
                                    type="text"
                                />
                                <button
                                    aria-label="Toggle password visibility"
                                    class="variant-filled-primary btn-icon rounded-l-none rounded-r-lg"
                                    on:click={toggleShow1}
                                    tabindex="0"
                                    type="button"
                                    ><Fa class="text-white" icon={faEyeSlash} size="sm" /></button
                                >
                            </div>
                        {:else}
                            <div class="flex">
                                <input
                                    bind:value={$form.password1}
                                    class="input rounded-r-none"
                                    name="password1"
                                    on:blur={handleChange}
                                    on:change={handleChange}
                                    placeholder="Enter a password"
                                    required
                                    tabindex="0"
                                    type="password"
                                />
                                <button
                                    aria-label="Toggle password visibility"
                                    class="variant-filled-primary btn-icon rounded-l-none rounded-r-lg"
                                    on:click={toggleShow1}
                                    tabindex="0"
                                    type="button"
                                    ><Fa class="text-white" icon={faEye} size="sm" /></button
                                >
                            </div>
                        {/if}
                        {#if $errors.password1}
                            <div
                                class="flex items-center gap-x-1 text-white"
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
                                <small class="text-error-500">{$errors.password1}</small>
                            </div>
                        {/if}
                        {#if showPassword2}
                            <div class="flex">
                                <input
                                    bind:value={$form.password2}
                                    class="input rounded-r-none"
                                    name="password2"
                                    on:blur={handleChange}
                                    on:change={handleChange}
                                    placeholder="Enter a password"
                                    required
                                    type="text"
                                />
                                <button
                                    aria-label="Toggle password confirmation visibility"
                                    class="variant-filled-primary btn-icon rounded-l-none rounded-r-lg text-white"
                                    on:click={toggleShow2}
                                    tabindex="0"
                                    type="button"
                                    ><Fa class="text-white" icon={faEyeSlash} size="sm" /></button
                                >
                            </div>
                        {:else}
                            <div class="flex">
                                <input
                                    bind:value={$form.password2}
                                    class="input rounded-r-none"
                                    name="password2"
                                    on:blur={handleChange}
                                    on:change={handleChange}
                                    placeholder="Enter a password"
                                    required
                                    type="password"
                                />
                                <button
                                    aria-label="Toggle password confirmation visibility"
                                    class="variant-filled-primary btn-icon rounded-l-none rounded-r-lg"
                                    on:click={toggleShow2}
                                    tabindex="0"
                                    type="button"
                                    ><Fa class="text-white" icon={faEye} size="sm" /></button
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
                                <Fa class="text-error-500" icon={faCircleExclamation} size="sm" />
                                <small class="text-error-500">{$errors.password2}</small>
                            </div>
                        {/if}
                        <button
                            aria-label="Submit form"
                            class="variant-filled-secondary btn flex gap-2 font-medium"
                            tabindex="0"
                            type="submit"
                        >
                            {#if isSubmitting}
                                <ProgressRadial stroke={100} width="w-6" />
                            {:else}
                                Submit
                            {/if}
                        </button>
                        <button
                            aria-label="Go back"
                            class="variant-filled-surface btn font-medium"
                            on:click={prevForm}
                            tabindex="0"
                            type="button">Go Back</button
                        >
                    </div>
                </div>
                {#if submissionError}
                    <div
                        class="alert variant-ghost-error mt-4 w-[360px] items-center"
                        in:slide={{
                            duration: 300,
                            easing: cubicInOut
                        }}
                        out:slide={{
                            duration: 300,
                            easing: cubicInOut
                        }}
                    >
                        <div class="w-ful grid h-full grid-cols-[auto_1fr] items-center gap-x-4">
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
                        <div class="w-ful grid h-full grid-cols-[auto_1fr] items-center gap-x-4">
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
