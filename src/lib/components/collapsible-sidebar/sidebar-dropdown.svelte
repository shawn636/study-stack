<script lang="ts">
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';

    import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

    import { Button } from '$lib/components/ui/button';
    import { cn } from '$lib/utils';
    import Fa from 'svelte-fa';
    import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
    import { page } from '$app/stores';

    interface Props {
        items: { href: string; icon: IconDefinition | undefined; title: string }[];
        class?: string | null | undefined;
    }

    const { items, class: className = undefined }: Props = $props();
    const activeItem = $derived(items.find((item) => item.href === $page.url.pathname));
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger class={cn(className, 'min-w-full')}>
        <div class="flex items-center justify-center gap-x-2">
            {#if activeItem?.icon}
                <Fa icon={activeItem.icon} />
            {/if}
            {activeItem?.title ?? 'Select an Item'}
            <Fa icon={faChevronDown} />
        </div>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            <DropdownMenu.Label>My Account</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <nav>
                {#each items as item}
                    <DropdownMenu.Item>
                        <Button data-sveltekit-noscroll href={item.href} variant="ghost">
                            <div class="relative flex flex-row gap-1">
                                {#if item.icon}
                                    <Fa class="h-5 w-5" icon={item.icon} />
                                {/if}
                                {item.title}
                            </div>
                        </Button>
                    </DropdownMenu.Item>
                {/each}
            </nav>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
