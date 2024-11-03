<script lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';

    import { cn } from '$lib/utils.js';
    type $$Props = HTMLAttributes<HTMLDivElement> & { variantNumber: 1 | 2 | 3 };

    interface Props {
        class?: $$Props['class'];
        style?: $$Props['style'];
        variantNumber?: 1 | 2 | 3;
    }

    const {
        class: className = undefined,
        style: styleProps = undefined,
        variantNumber = 1
    }: Props = $props();
</script>

{#each Array.from({ length: 2 }) as _, index}
    <svg
        class={cn(
            'absolute w-full animate-infinite-scroll',
            index === 1 ? 'left-full' : '',
            className
        )}
        preserveAspectRatio="none"
        style={styleProps}
        viewBox="0 0 1024 76"
        width="1024"
        xmlns="http://www.w3.org/2000/svg"
    >
        {#if variantNumber === 1}
            <path
                d="M0 52.1001V0H1024V52.1001C841 5.75753 648 26.9904 479.5 54.4021C311 81.8139 129 85.3458 0 52.1001Z"
            />
        {:else if variantNumber === 2}
            <path
                d="M0 47.0476V0H1024V47.0476C966 19.3488 924.5 56.3058 845 69.9281C775.029 81.9176 702.013 73.5838 669 56.7598C590 16.5 432.5 95.0907 375.5 56.7598C336.5 30.5335 269.5 37.044 230 47.3151C206.446 53.4398 132.149 68.4546 87.5 69.02C32.6308 69.7147 22 56.4924 0 47.0476Z"
            />
        {:else if variantNumber === 3}
            <path
                d="M0 60.4008V0H1024V60.4008C1005.5 64.4662 974.102 74.2253 944.5 60.4008C896 37.7505 859.5 45.3006 819 60.4008C759 82.7714 710.5 79.5664 666.5 60.4008C618.5 39.4928 548 43.5582 501.5 60.4008C449 79.4165 388.795 78.5984 343 60.4008C308 46.4927 235 42.864 199.5 60.4008C164 77.9376 113 76.5696 84 60.4008C55 44.2319 8.33333 58.4648 0 60.4008Z"
            />
        {/if}
    </svg>
{/each}
