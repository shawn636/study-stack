<script lang="ts">
    import Fa from 'svelte-fa';
    import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
    import type { WithElementRef, WithoutChildren } from 'bits-ui';
    import type { HTMLAttributes } from 'svelte/elements';
    import { cn } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        class: className,
        ...restProps
    }: WithoutChildren<WithElementRef<HTMLAttributes<HTMLSpanElement>>> = $props();
</script>

<span
    bind:this={ref}
    aria-hidden="true"
    class={cn('flex size-9 items-center justify-center', className)}
    {...restProps}
>
    <Fa class="h-4 w-4" icon={faEllipsisH} />
    <span class="sr-only">More pages</span>
</span>
