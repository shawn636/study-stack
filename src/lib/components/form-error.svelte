<script lang="ts">
    import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
    import { cubicInOut } from 'svelte/easing';
    import { slide } from 'svelte/transition';
    import Fa from 'svelte-fa';

    export let error: string;
</script>

{#if error}
    <div
        class="flex items-center gap-x-1 pt-2"
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
        <Fa class="text-error-500" icon={faCircleExclamation} size="sm" />
        <small class="text-error-500">{error}</small>
    </div>
{/if}
