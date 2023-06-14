<script lang="ts">
    import Sidebar from '$lib/components/sidebar.svelte';
    import Header from '$lib/sections/header.svelte';
    import Footer from '$lib/sections/footer.svelte';
    import { AppShell } from '@skeletonlabs/skeleton';
    import type { LayoutData } from './$types';
    import type User from '$lib/models/user';
    import { getSidebarLinks } from '$lib/stores/links';
    import Fa from 'svelte-fa';

    export let data: LayoutData;
    $: user = data.user as User;
    const links = getSidebarLinks();
</script>

<Sidebar {user} />
<AppShell slotPageFooter="bg-surface-100 dark:bg-surface-700">
    <svelte:fragment slot="header">
        <Header {user} />
    </svelte:fragment>

    <svelte:fragment slot="sidebarLeft">
        <nav class="list-nav bg-surface-100 dark:bg-surface-900/70 h-full p-2">
            {#each links as link}
                <a href={link.href} class="list-nav-item">
                    {#if link.icon}
                        <span class="list-nav-icon">
                            <Fa icon={link.icon} />
                        </span>
                    {/if}
                    <span class="list-nav-text">{link.name}</span>
                </a>
            {/each}
        </nav>
    </svelte:fragment>

    <div class="p-4">
        <slot />
    </div>
</AppShell>
