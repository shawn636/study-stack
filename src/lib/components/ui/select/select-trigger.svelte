<script lang="ts">
    import { cn } from '$lib/utils.js';
    import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
    import { Select as SelectPrimitive } from 'bits-ui';
    import Fa from 'svelte-fa';

    type $$Props = SelectPrimitive.TriggerProps;
    type $$Events = SelectPrimitive.TriggerEvents;

    let className: $$Props['class'] = undefined;
    export { className as class };
</script>

<SelectPrimitive.Trigger
    class={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className
    )}
    {...$$restProps}
    let:builder
    on:click
    on:keydown
>
    <slot {builder} />
    <div>
        <Fa class="h-4 w-4 opacity-50" icon={faChevronDown} />
    </div>
</SelectPrimitive.Trigger>
