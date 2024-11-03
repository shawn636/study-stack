<script lang="ts">
    import Fa from 'svelte-fa';
    import { faCheck } from '@fortawesome/free-solid-svg-icons';
    import { Select as SelectPrimitive, type WithoutChild } from 'bits-ui';
    import { cn } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        class: className,
        value,
        label,
        children: childrenProp,
        ...restProps
    }: WithoutChild<SelectPrimitive.ItemProps> = $props();
</script>

<SelectPrimitive.Item
    bind:ref
    {value}
    class={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
        className
    )}
    {...restProps}
>
    {#snippet children({ selected, highlighted })}
        <span class="absolute left-2 flex size-3.5 items-center justify-center">
            {#if selected}
                <Fa class="h-4 w-4" icon={faCheck} />
            {/if}
        </span>
        {#if childrenProp}
            {@render childrenProp({ selected, highlighted })}
        {:else}
            {label || value}
        {/if}
    {/snippet}
</SelectPrimitive.Item>
