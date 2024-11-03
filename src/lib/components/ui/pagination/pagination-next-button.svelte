<script lang="ts">
    import { Pagination as PaginationPrimitive } from 'bits-ui';
    import Fa from 'svelte-fa';
    import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
    import { buttonVariants } from '$lib/components/ui/button/index.js';
    import { cn } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        class: className,
        children,
        ...restProps
    }: PaginationPrimitive.NextButtonProps = $props();
</script>

{#snippet Fallback()}
    <span>Next</span>
    <Fa class="h-4 w-4" icon={faChevronRight} />
{/snippet}

<PaginationPrimitive.NextButton
    bind:ref
    class={cn(
        buttonVariants({
            variant: 'ghost',
            class: 'gap-1 pr-2.5'
        }),
        className
    )}
    children={children || Fallback}
    {...restProps}
/>
