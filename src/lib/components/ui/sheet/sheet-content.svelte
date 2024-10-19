<script lang="ts">
    import { cn } from '$lib/utils.js';
    import Fa from 'svelte-fa';
    import { faX } from '@fortawesome/free-solid-svg-icons';
    import { fly } from 'svelte/transition';
    import { Dialog as SheetPrimitive } from 'bits-ui';

    import {
        SheetOverlay,
        SheetPortal,
        sheetTransitions,
        sheetVariants,
        type Side
    } from './index.js';

    type $$Props = SheetPrimitive.ContentProps & {
        side?: Side;
    };

    let className: $$Props['class'] = undefined;
    export let side: $$Props['side'] = 'right';
    export { className as class };
    export let inTransition: $$Props['inTransition'] = fly;
    export let inTransitionConfig: $$Props['inTransitionConfig'] =
        sheetTransitions[side ?? 'right'].in;
    export let outTransition: $$Props['outTransition'] = fly;
    export let outTransitionConfig: $$Props['outTransitionConfig'] =
        sheetTransitions[side ?? 'right'].out;
</script>

<SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
        class={cn(sheetVariants({ side }), className)}
        {inTransition}
        {inTransitionConfig}
        {outTransition}
        {outTransitionConfig}
        {...$$restProps}
    >
        <slot />
        <SheetPrimitive.Close
            class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        >
            <Fa icon={faX} size="lg" />
            <span class="sr-only">Close</span>
        </SheetPrimitive.Close>
    </SheetPrimitive.Content>
</SheetPortal>
