<script lang="ts">
    import { Accordion as AccordionPrimitive } from 'bits-ui';
    import { cn } from '$lib/utils.js';
    import Fa from 'svelte-fa';
    import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

    type $$Props = AccordionPrimitive.TriggerProps;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type $$Events = AccordionPrimitive.TriggerEvents;

    let className: $$Props['class'] = undefined;
    export let level: AccordionPrimitive.HeaderProps['level'] = 3;
    export { className as class };
</script>

<AccordionPrimitive.Header class="flex" {level}>
    <AccordionPrimitive.Trigger
        class={cn(
            'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
            className
        )}
        {...$$restProps}
        on:click
    >
        <slot />
        <Fa class="h-4 w-4 transition-transform duration-200" icon={faChevronDown} />
    </AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
