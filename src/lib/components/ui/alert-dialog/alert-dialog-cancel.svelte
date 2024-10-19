<script lang="ts">
    import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
    import { buttonVariants } from '$lib/components/ui/button/index.js';
    import { cn } from '$lib/utils.js';
    import { type VariantProps } from 'tailwind-variants';

    type $$Props = AlertDialogPrimitive.CancelProps & {
        variant?: VariantProps<typeof buttonVariants>['variant'];
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type $$Events = AlertDialogPrimitive.CancelEvents;

    let className: $$Props['class'] = undefined;
    export let variant: $$Props['variant'] = 'outline';
    export { className as class };
</script>

<AlertDialogPrimitive.Cancel
    class={cn(buttonVariants({ variant: variant }), 'mt-2 sm:mt-0', className)}
    {...$$restProps}
    on:click
    on:keydown
    let:builder
>
    <slot {builder} />
</AlertDialogPrimitive.Cancel>
