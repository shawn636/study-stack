<script lang="ts">
    import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

    import { Button } from '$lib/components/ui/button';
    import { cn } from '$lib/utils';
    import { crossfade } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
    import Fa from 'svelte-fa';
    import { page } from '$app/stores';

    interface Props {
        class?: string | null | undefined;
        items: { href: string; icon: IconDefinition | undefined; title: string }[];
    }

    let { class: className = undefined, items }: Props = $props();
    

    const [send, receive] = crossfade({
        duration: 250,
        easing: cubicInOut
    });
</script>

<nav class={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)}>
    {#each items as item}
        {@const isActive = $page.url.pathname === item.href}

        <Button
            class={cn(
                !isActive && 'hover:underline',
                'relative justify-start hover:bg-transparent'
            )}
            data-sveltekit-noscroll
            href={item.href}
            variant="ghost"
        >
            {#if isActive}
                <div
                    class="absolute inset-0 rounded-md bg-muted"
                    in:send={{ key: 'active-sidebar-tab' }}
                    out:receive={{ key: 'active-sidebar-tab' }}
                ></div>
            {/if}
            <div class="relative flex flex-row items-center gap-2">
                {#if item.icon}
                    <Fa class="h-5 w-5" icon={item.icon} />
                {/if}
                {item.title}
            </div>
        </Button>
    {/each}
</nav>
