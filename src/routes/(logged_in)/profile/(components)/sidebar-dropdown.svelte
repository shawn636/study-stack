<script lang="ts">
    import { page } from '$app/stores';
    import { Button } from '$lib/components/ui/button';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
    import { cn } from '$lib/utils';
    import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
    export let items: { href: string; title: string }[];

    let className: null | string | undefined = undefined;
    $: activeItem = items.find((item) => item.href === $page.url.pathname);
    export { className as class };
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger class="min-w-full">
        <Button class={cn('w-full', className)} variant="default">
            <div class="flex items-center justify-center gap-x-2">
                {activeItem?.title ?? 'Select an Item'}
                <Fa icon={faChevronDown} />
            </div>
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            <DropdownMenu.Label>My Account</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <nav>
                {#each items as item}
                    <DropdownMenu.Item>
                        <Button data-sveltekit-noscroll href={item.href} variant="ghost">
                            <div class="relative">
                                {item.title}
                            </div>
                        </Button>
                    </DropdownMenu.Item>
                {/each}
            </nav>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
