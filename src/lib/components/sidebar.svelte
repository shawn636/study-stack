<script lang="ts">
    import type { User } from '@prisma/client';

    import { page } from '$app/stores';
    import { getHeaderLinks } from '$lib/stores/links';
    import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';

    const drawerStore = getDrawerStore();
    $: classesActive = (href: string) =>
        href === $page.url.pathname ? '!bg-primary-500 !text-white' : '';

    export let user: User | null | undefined = null;
    $: headerLinks = getHeaderLinks(user === null ? false : true);
</script>

<Drawer width="w-64">
    <div class="grid h-full p-4">
        <div class="container space-y-4">
            {#if $drawerStore.id === 'sidebar'}
                <nav class="list-nav">
                    <ul>
                        {#each headerLinks as link}
                            <li>
                                <a
                                    class="flex-auto {classesActive(link.href)}"
                                    href={link.href}
                                    on:click={drawerStore.close}>{link.name}</a
                                >
                            </li>
                        {/each}
                    </ul>
                </nav>
                {#if !user}
                    <a class="variant-soft btn w-full" href="/auth/login"> Sign In </a>
                    <a class="variant-filled btn w-full" href="/auth/register"> Register </a>
                {/if}
            {/if}
        </div>
    </div>
</Drawer>
