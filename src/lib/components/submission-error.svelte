<script lang="ts">
    import { faCircleCheck, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

    import { cubicInOut } from 'svelte/easing';
    import Fa from 'svelte-fa';
    import { slide } from 'svelte/transition';

    export let submissionError: string | null = null;
    export let showSuccess = false;
    export let successMessage: string;
</script>

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
        role="alert"
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
        class="alert variant-ghost-success mt-4"
        in:slide={{
            duration: 300,
            easing: cubicInOut
        }}
        out:slide={{
            duration: 300,
            easing: cubicInOut
        }}
        role="alert"
    >
        <div class="alert-message grid grid-flow-col items-center gap-x-2 text-center">
            <Fa icon={faCircleCheck} />
            <p class="pb-1">{successMessage}</p>
        </div>
    </div>
{/if}
