<script lang="ts">
    import { cn } from '$lib/utils.js';
    import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
    import Fa from 'svelte-fa';
    import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

    type $$Props = DropdownMenuPrimitive.SubTriggerProps & {
        inset?: boolean;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type $$Events = DropdownMenuPrimitive.SubTriggerEvents;

    let className: $$Props['class'] = undefined;
    export let inset: $$Props['inset'] = undefined;
    export { className as class };
</script>

<DropdownMenuPrimitive.SubTrigger
    class={cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[state=open]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:text-accent-foreground',
        inset && 'pl-8',
        className
    )}
    {...$$restProps}
    on:click
    on:focusin
    on:focusout
    on:keydown
    on:pointerleave
    on:pointermove
>
    <slot />
    <Fa class="ml-auto h-4 w-4" icon={faChevronRight} />
</DropdownMenuPrimitive.SubTrigger>
