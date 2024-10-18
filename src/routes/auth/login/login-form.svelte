<script lang="ts">
    import { faCircleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons';

    import { Button } from '$lib/components/ui/button';
    import { cubicInOut } from 'svelte/easing';
    import Fa from 'svelte-fa';
    import { Input } from '$lib/components/ui/input';
    import { slide } from 'svelte/transition';
    import { submissionState } from './submission-stores';

    export let form;
    export let errors;
    export let touched;
    export let handleChange;
    export let handleSubmit;
</script>

<form
    class="text-md grid w-full grid-flow-row gap-y-4"
    data-testid="sign-in-form"
    id="register-form"
    on:submit={handleSubmit}
>
    <div>
        <Input
            bind:value={$form.email}
            class="input
                {$errors.email ? 'border-error-500' : ''}
                {!$errors.email && $touched.email ? 'border-success-700' : ''}"
            name="email"
            on:blur={handleChange}
            on:change={handleChange}
            placeholder="Email"
            type="email"
        />
        {#if $errors.email}
            <div
                class="mx-1 mt-2 flex items-center gap-x-1"
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
        <Input
            bind:value={$form.password}
            class="input
                {$errors.password ? 'border-error-500' : ''}
                {!$errors.password && $touched.password ? 'border-success-700' : ''}"
            name="password"
            on:blur={handleChange}
            on:change={handleChange}
            placeholder="Password"
            type="password"
        />
        {#if $errors.password}
            <div class="mx-1 mt-2 flex items-center gap-x-1">
                <Fa class="text-error-500" icon={faCircleExclamation} size="sm" />
                <small class="text-error-500">{$errors.password}</small>
            </div>
        {/if}
    </div>
    <Button
        aria-label="continue"
        class="font-medium"
        disabled={$submissionState === 'submitting'}
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
