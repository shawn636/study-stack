<script lang="ts">
    import { type Size, toggleVariants, type Variant } from './index.js';

    import { cn } from '$lib/utils.js';
    import { Toggle as TogglePrimitive } from 'bits-ui';

    type $$Props = TogglePrimitive.Props & {
        variant?: Variant;
        size?: Size;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type $$Events = TogglePrimitive.Events;

    let className: $$Props['class'] = undefined;
    export let variant: $$Props['variant'] = 'default';
    export let size: $$Props['size'] = 'default';
    export let pressed: $$Props['pressed'] = undefined;
    export { className as class };
</script>

<TogglePrimitive.Root
    bind:pressed
    class={cn(toggleVariants({ variant, size, className }))}
    {...$$restProps}
    on:click
>
    <slot />
</TogglePrimitive.Root>
