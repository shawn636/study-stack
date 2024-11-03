<script lang="ts">
    import type { Writable } from 'svelte/store';

    import { faCircleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons';

    import { Button } from '$lib/components/ui/button';
    import { cubicInOut } from 'svelte/easing';
    import Fa from 'svelte-fa';
    import { Input } from '$lib/components/ui/input';
    import { slide } from 'svelte/transition';
    import { submissionState } from './submit-form.svelte';

    interface Props {
        form: Writable<{ email: string; password: string }>;
        errors: Writable<Record<'email' | 'password', string>>;
        touched: Writable<Record<'email' | 'password', boolean>>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleChange: (event: Event) => any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleSubmit: (event: Event) => any;
    }

    const { form, errors, touched, handleChange, handleSubmit }: Props = $props();
</script>

<form
    class="text-md grid w-full grid-flow-row gap-y-4"
    data-testid="sign-in-form"
    id="register-form"
    onsubmit={handleSubmit}
>
    <div>
        <Input
            bind:value={$form.email}
            class="input
                {$errors.email ? 'border-error-500' : ''}
                {!$errors.email && $touched.email ? 'border-success-700' : ''}"
            name="email"
            onblur={handleChange}
            onchange={handleChange}
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
            onblur={handleChange}
            onchange={handleChange}
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
        disabled={submissionState.value === 'submitting'}
        type="submit"
        variant="default"
    >
        {#if submissionState.value === 'submitting'}
            <Fa class="animate-spin" icon={faSpinner} size="lg" />
        {:else}
            Submit
        {/if}
    </Button>
</form>
