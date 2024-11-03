<script lang="ts">
    import { cubicInOut } from 'svelte/easing';
    import Fa from 'svelte-fa';
    import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
    import { slide } from 'svelte/transition';

    interface Props {
        error: string;
    }

    const { error = $bindable() }: Props = $props();
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
