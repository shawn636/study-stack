<script lang="ts">
    import Logo from '$lib/components/logo.svelte';
    import { page } from '$app/stores';
    import { AppBar, type DrawerSettings } from '@skeletonlabs/skeleton';
    import { getDrawerStore } from '@skeletonlabs/skeleton';
    import { getHeaderLinks } from '$lib/stores/links';
    import ProfileMenu from '$lib/components/profile-menu.svelte';
    import Fa from 'svelte-fa';
    import { faBars } from '@fortawesome/free-solid-svg-icons';
    import type User from '$lib/models/user';

    export let user: User | undefined;

    $: headerLinks = getHeaderLinks(user == null ? false : true);

    const drawerStore = getDrawerStore();
    const drawerSettings: DrawerSettings = {
        id: 'sidebar',
        position: 'left'
    };
</script>

<AppBar
    background="bg-primary-500 dark:bg-primary-700"
    gridColumns="grid-cols-3"
    slotDefault="place-self-center"
    slotTrail="place-content-end"
    padding="px-5"
    class="text-white"
>
    <svelte:fragment slot="lead">
        <div class="flex">
            <button
                aria-label="Toggle sidebar"
                class="outline-none btn"
                on:click={() => {
                    drawerStore.open(drawerSettings);
                }}
            >
                <Fa icon={faBars} size="24" />
            </button>
            <a href="/"><Logo color="black" /></a>
        </div>
    </svelte:fragment>
    <div class="items-center hidden grid-flow-col lg:grid">
        {#each headerLinks as link}
            {#if $page.url.pathname == link.href}
                <a class="font-semibold btn" href={link.href}>{link.name}</a>
            {:else}
                <a class="btn" href={link.href}>{link.name}</a>
            {/if}
        {/each}
    </div>
    <svelte:fragment slot="trail">
        {#if user}
            <ProfileMenu {user} />
        {:else}
            <div class="items-center hidden px-2 sm:grid grid-flow-col justify-self-end gap-x-4">
                <a
                    class="text-white hover:anchor transition-all hover:text-white"
                    href="/auth/login">Sign In</a
                >
                <a
                    class="bg-white btn btn-sm variant-filled text-primary-600 hover:shadow-md hover:scale-105"
                    href="/auth/register"
                >
                    Get Started
                </a>
            </div>
        {/if}
    </svelte:fragment>
</AppBar>
