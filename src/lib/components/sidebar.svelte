<script lang="ts">
    import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
    import { page } from '$app/stores';
    import { getHeaderLinks } from '$lib/stores/links';
    import type User from '$lib/models/user';

    $: classesActive = (href: string) =>
        href === $page.url.pathname ? '!bg-primary-500 !text-white' : '';

    export let user: User | undefined | null = null;
    $: headerLinks = getHeaderLinks(user == null ? false : true);
</script>

<Drawer width="w-64">
    <div class="h-full p-4 grid">
        <div class="container space-y-4">
            {#if $drawerStore.id == 'sidebar'}
                <nav class="list-nav">
                    <ul>
                        {#each headerLinks as link}
                            <li>
                                <a
                                    on:click={drawerStore.close}
                                    href={link.href}
                                    class="flex-auto {classesActive(link.href)}">{link.name}</a
                                >
                            </li>
                        {/each}
                    </ul>
                </nav>
                {#if !user}
                    <a href="/auth/login" class="w-full btn variant-soft"> Sign In </a>
                    <a href="/auth/register" class="w-full btn variant-filled"> Register </a>
                {/if}
            {/if}
        </div>
    </div>
</Drawer>
