<script lang="ts">
    import {
        faCircleExclamation,
        faEye,
        faEyeSlash,
        faSpinner
    } from '@fortawesome/free-solid-svg-icons';

    import { Button } from '$lib/components/ui/button';
    import { cubicInOut } from 'svelte/easing';
    import Fa from 'svelte-fa';
    import { Input } from '$lib/components/ui/input';
    import { slide } from 'svelte/transition';
    import { submissionState } from './submission-stores';
    import { Toggle } from '$lib/components/ui/toggle';

    export let errors;
    export let form;
    export let handleChange;
    export let handleSubmit;
    export let showPassword1: boolean;
    export let showPassword2: boolean;
</script>

<form
    class="text-md grid grid-flow-row gap-y-4"
    data-testid="sign-up-form"
    id="register-form"
    on:submit={handleSubmit}
>
    <div>
        <Input
            bind:value={$form.name}
            data-testid="name-input"
            name="name"
            on:blur={handleChange}
            on:change={handleChange}
            placeholder="Name"
            type="text"
        />
        {#if $errors.name}
            <div
                class="mx-1 mt-2 flex items-center gap-x-2"
                data-testid="name-error"
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
                <small class="text-error-500">{$errors.name}</small>
            </div>
        {/if}
    </div>

    <div>
        <Input
            bind:value={$form.email}
            data-testid="email-input"
            name="email"
            on:blur={handleChange}
            on:change={handleChange}
            placeholder="Email"
            type="email"
        />
        {#if $errors.email}
            <div
                class="mx-1 mt-2 flex items-center gap-x-2"
                data-testid="email-error"
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
                <small class="text-error-500">{$errors.email}</small>
            </div>
        {/if}
    </div>

    <div>
        <div class="flex gap-2">
            <Input
                bind:value={$form.password1}
                data-testid="password1-input"
                name="password1"
                on:blur={handleChange}
                on:change={handleChange}
                placeholder="Enter a password"
                required
                type={showPassword1 ? 'text' : 'password'}
            />
            <Toggle bind:pressed={showPassword1} variant="outline">
                <Fa class="h-4 w-4" icon={showPassword1 ? faEye : faEyeSlash} />
            </Toggle>
        </div>
        {#if $errors.password1}
            <div
                class="mx-1 mt-2 flex items-center gap-x-2 text-left text-primary"
                data-testid="password1-error"
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
    </div>
    <div>
        <div class="flex gap-2">
            <Input
                bind:value={$form.password2}
                data-testid="password2-input"
                name="password2"
                on:blur={handleChange}
                on:change={handleChange}
                placeholder="Enter a password"
                required
                type={showPassword2 ? 'text' : 'password'}
            />
            <Toggle bind:pressed={showPassword2} variant="outline">
                <Fa class="h-4 w-4" icon={showPassword2 ? faEye : faEyeSlash} />
            </Toggle>
        </div>

        {#if $errors.password2}
            <div
                class="mx-1 mt-2 flex items-center gap-x-1"
                data-testid="password2-error"
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
    </div>

    <Button
        aria-label="Submit form"
        class="font-medium"
        data-testid="submit-button"
        type="submit"
        variant="default"
    >
        {#if $submissionState === 'submitting'}
            <Fa class="animate-spin" icon={faSpinner} size="lg" />
        {:else}
            Submit
        {/if}
    </Button>
</form>
