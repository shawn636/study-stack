<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    import { cn } from '$lib/utils.js';
    import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
    // import Ellipsis from 'lucide-svelte/icons/ellipsis';
    import Fa from 'svelte-fa';

    type $$Props = HTMLAttributes<HTMLSpanElement>;

    let className: $$Props['class'] = undefined;
    export { className as class };
</script>

<span
    aria-hidden
    class={cn('flex h-9 w-9 items-center justify-center', className)}
    {...$$restProps}
>
    <Fa class="h-4 w-4" icon={faEllipsis} />
    <span class="sr-only">More pages</span>
</span>
