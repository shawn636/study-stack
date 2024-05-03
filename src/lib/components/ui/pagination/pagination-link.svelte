<script lang="ts">
    import { type Props, buttonVariants } from '$lib/components/ui/button/index.js';
    import { cn } from '$lib/utils.js';
    import { Pagination as PaginationPrimitive } from 'bits-ui';

    type $$Props = {
        isActive: boolean;
    } & PaginationPrimitive.PageProps &
        Props;

    type $$Events = PaginationPrimitive.PageEvents;

    let className: $$Props['class'] = undefined;
    export let page: $$Props['page'];
    export let size: $$Props['size'] = 'icon';
    export let isActive: $$Props['isActive'] = false;

    export { className as class };
</script>

<PaginationPrimitive.Page
    bind:page
    class={cn(
        buttonVariants({
            size,
            variant: isActive ? 'outline' : 'ghost'
        }),
        className
    )}
    {...$$restProps}
    on:click
>
    <slot>{page.value}</slot>
</PaginationPrimitive.Page>
