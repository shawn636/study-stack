<script lang="ts">
    import Fa from 'svelte-fa';
    import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
    import { Select as SelectPrimitive, type WithoutChildrenOrChild } from 'bits-ui';
    import { cn } from '$lib/utils.js';

    let {
        ref = $bindable(null),
        class: className,
        ...restProps
    }: WithoutChildrenOrChild<SelectPrimitive.ScrollUpButtonProps> = $props();
</script>

<SelectPrimitive.ScrollUpButton
    bind:ref
    class={cn('flex cursor-default items-center justify-center py-1', className)}
    {...restProps}
>
    <Fa class="h-4 w-4" icon={faChevronUp} />
</SelectPrimitive.ScrollUpButton>
