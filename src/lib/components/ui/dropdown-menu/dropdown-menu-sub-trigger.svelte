<script lang="ts">
    import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
    import Fa from 'svelte-fa';
    import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
    import { cn } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        class: className,
        inset,
        children,
        ...restProps
    }: DropdownMenuPrimitive.SubTriggerProps & {
        inset?: boolean;
    } = $props();
</script>

<DropdownMenuPrimitive.SubTrigger
    bind:ref
    class={cn(
        'flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        inset && 'pl-8',
        className
    )}
    {...restProps}
>
    {@render children?.()}
    <Fa class="ml-auto" icon={faChevronRight} />
</DropdownMenuPrimitive.SubTrigger>
