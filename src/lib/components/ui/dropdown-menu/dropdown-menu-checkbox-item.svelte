<script lang="ts">
    import { DropdownMenu as DropdownMenuPrimitive, type WithoutChild } from 'bits-ui';
    import Fa from 'svelte-fa';
    import { faCheck, faMinus } from '@fortawesome/free-solid-svg-icons';
    import { cn } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        checked = $bindable(false),
        class: className,
        children: childrenProp,
        ...restProps
    }: WithoutChild<DropdownMenuPrimitive.CheckboxItemProps> = $props();
</script>

<DropdownMenuPrimitive.CheckboxItem
    bind:ref
    bind:checked
    class={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
        className
    )}
    {...restProps}
>
    {#snippet children({ checked })}
        <span class="absolute left-2 flex size-3.5 items-center justify-center">
            {#if checked === 'indeterminate'}
                <Fa class="h-4 w-4" icon={faMinus} />
            {:else}
                <Fa class={cn('h-4 w-4', !checked && 'text-transparent')} icon={faCheck} />
            {/if}
        </span>
        {@render childrenProp?.({ checked })}
    {/snippet}
</DropdownMenuPrimitive.CheckboxItem>
