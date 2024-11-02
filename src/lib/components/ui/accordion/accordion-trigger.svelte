<script lang="ts">
    import { Accordion as AccordionPrimitive, type WithoutChild } from 'bits-ui';
    import Fa from 'svelte-fa';
    import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
    import { cn } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        class: className,
        level = 3,
        children,
        ...restProps
    }: WithoutChild<AccordionPrimitive.TriggerProps> & {
        level?: AccordionPrimitive.HeaderProps['level'];
    } = $props();
</script>

<AccordionPrimitive.Header {level} class="flex">
    <AccordionPrimitive.Trigger
        bind:ref
        class={cn(
            'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
            className
        )}
        {...restProps}
    >
        {@render children?.()}
        <Fa class="size-4 shrink-0 transition-transform duration-200" icon={faChevronDown} />
    </AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
