<script lang="ts">
    // import ChevronDown from "lucide-svelte/icons/chevron-down";
    import { cn } from '$lib/utils.js';
    import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
    import { Accordion as AccordionPrimitive } from 'bits-ui';
    import Fa from 'svelte-fa';

    type $$Props = AccordionPrimitive.TriggerProps;
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
        <!-- <ChevronDown class="h-4 w-4 transition-transform duration-200" /> -->
    </AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
