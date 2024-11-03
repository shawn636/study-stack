<script lang="ts">
    import { Pagination as PaginationPrimitive } from 'bits-ui';
    import Fa from 'svelte-fa';
    import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
    import { buttonVariants } from '$lib/components/ui/button/index.js';
    import { cn } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        class: className,
        children,
        ...restProps
    }: PaginationPrimitive.PrevButtonProps = $props();
</script>

{#snippet Fallback()}
    <Fa class="h-4 w-4" icon={faChevronLeft} />
    <span>Previous</span>
{/snippet}

<PaginationPrimitive.PrevButton
    bind:ref
    class={cn(
        buttonVariants({
            variant: 'ghost',
            class: 'gap-1 pl-2.5'
        }),
        className
    )}
    children={children || Fallback}
    {...restProps}
/>
