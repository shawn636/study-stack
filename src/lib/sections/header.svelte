<script lang="ts">
    import Logo from '$lib/components/logo.svelte';
    import { page } from '$app/stores';
    import { AppBar, Avatar, popup } from '@skeletonlabs/skeleton';
    import { drawerStore } from '@skeletonlabs/skeleton';
    import { getHeaderLinks } from '$lib/stores/links';
    import Fa from 'svelte-fa';
    import { faBars } from '@fortawesome/free-solid-svg-icons';
    import type User from '$lib/models/user';
    import { goto } from '$app/navigation';

    export let user: User | undefined;

    const initials = (name: string) => {
        const names = name.split(' ');
        return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
    };

    const signOut = async () => {
        const res = await fetch('/auth/logout', {
            method: 'POST'
        });
        if (res.status == 200) {
            console.log(res.status);
            goto('/auth/login');
        }
    };

    $: headerLinks = getHeaderLinks(user == null ? false : true);
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
                class="btn outline-none"
                on:click={() => {
                    drawerStore.open();
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
                <a class="btn font-semibold" href={link.href}>{link.name}</a>
            {:else}
                <a class="btn" href={link.href}>{link.name}</a>
            {/if}
        {/each}
    </div>
    <svelte:fragment slot="trail">
        {#if user}
            <button
                class="btn btn-icon"
                use:popup={{ event: 'click', target: 'profile', placement: 'bottom' }}
            >
                <Avatar initials={initials(user.name)} />
            </button>
            <div class="card w-64 p-4 grid grid-flow-row rounded-xl shadow-xl" data-popup="profile">
                <p class="font-bold">{user.name}</p>
                <p>{user.email}</p>
                <button class="btn variant-filled" on:click={signOut}>Sign Out</button>
            </div>
        {:else}
            <div class="hidden sm:grid items-center grid-flow-col px-2 justify-self-end gap-x-4">
                <a
                    class="text-white hover:anchor transition-all hover:text-white"
                    href="/auth/login">Sign In</a
                >
                <a
                    class="btn btn-sm variant-filled bg-white text-primary-600 hover:shadow-md hover:scale-105"
                    href="/auth/register"
                >
                    Get Started
                </a>
            </div>
        {/if}
    </svelte:fragment>
</AppBar>
