<script lang="ts">
    import { cn } from '$lib/utils.js';
    import Fa from 'svelte-fa';
    import { faCheck } from '@fortawesome/free-solid-svg-icons';
    import { Select as SelectPrimitive } from 'bits-ui';

    type $$Props = SelectPrimitive.ItemProps;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type $$Events = SelectPrimitive.ItemEvents;

    let className: $$Props['class'] = undefined;
    export let value: $$Props['value'];
    export let label: $$Props['label'] = undefined;
    export let disabled: $$Props['disabled'] = undefined;
    export { className as class };
</script>

<SelectPrimitive.Item
    class={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
        className
    )}
    {disabled}
    {label}
    {value}
    {...$$restProps}
    on:click
    on:focusin
    on:focusout
    on:keydown
    on:pointerleave
    on:pointermove
>
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
            <Fa class="h-4 w-4" icon={faCheck} />
        </SelectPrimitive.ItemIndicator>
    </span>
    <slot>
        {label || value}
    </slot>
</SelectPrimitive.Item>
