<script lang="ts">
    import type User from '$lib/models/user';

    import { page } from '$app/stores';
    import Logo from '$lib/components/logo.svelte';
    import ProfileMenu from '$lib/components/profile-menu.svelte';
    import { getHeaderLinks } from '$lib/stores/links';
    import { faBars } from '@fortawesome/free-solid-svg-icons';
    import { AppBar, type DrawerSettings } from '@skeletonlabs/skeleton';
    import { getDrawerStore } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa';

    export let user: User | undefined;

    $: headerLinks = getHeaderLinks(user === null ? false : true);

    const drawerStore = getDrawerStore();
    const drawerSettings: DrawerSettings = {
        id: 'sidebar',
        position: 'left'
    };
</script>

<AppBar
    background="bg-primary-500 dark:bg-primary-700"
    class="text-white"
    gridColumns="grid-cols-3"
    padding="px-5"
    slotDefault="place-self-center"
    slotTrail="place-content-end"
>
    <svelte:fragment slot="lead">
        <div class="flex">
            <button
                aria-label="Toggle sidebar"
                class="btn outline-none"
                on:click={() => {
                    drawerStore.open(drawerSettings);
                }}
            >
                <Fa icon={faBars} size="lg" />
            </button>
            <a href="/"><Logo color="black" /></a>
        </div>
    </svelte:fragment>
    <div class="hidden grid-flow-col items-center lg:grid">
        {#each headerLinks as link}
            {#if $page.url.pathname === link.href}
                <a class="btn font-semibold" href={link.href}>{link.name}</a>
            {:else}
                <a class="btn" href={link.href}>{link.name}</a>
            {/if}
        {/each}
    </div>
    <svelte:fragment slot="trail">
        {#if user}
            <ProfileMenu {user} />
        {:else}
            <div class="hidden grid-flow-col items-center gap-x-4 justify-self-end px-2 sm:grid">
                <a
                    class="text-white transition-all hover:anchor hover:text-white"
                    href="/auth/login">Sign In</a
                >
                <a
                    class="variant-filled btn btn-sm bg-white text-primary-600 hover:scale-105 hover:shadow-md"
                    href="/auth/register"
                >
                    Get Started
                </a>
            </div>
        {/if}
    </svelte:fragment>
</AppBar>
