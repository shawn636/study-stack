<script lang="ts">
    import { DropdownMenu as DropdownMenuPrimitive, type WithoutChild } from 'bits-ui';
    import { faCircle } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
    import { cn } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        class: className,
        children: childrenProp,
        ...restProps
    }: WithoutChild<DropdownMenuPrimitive.RadioItemProps> = $props();
</script>

<DropdownMenuPrimitive.RadioItem
    bind:ref
    class={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
        className
    )}
    {...restProps}
>
    {#snippet children({ checked })}
        <span class="absolute left-2 flex size-3.5 items-center justify-center">
            {#if checked}
                <Fa class="size-2 fill-current" icon={faCircle} />
            {/if}
        </span>
        {@render childrenProp?.({ checked })}
    {/snippet}
</DropdownMenuPrimitive.RadioItem>
