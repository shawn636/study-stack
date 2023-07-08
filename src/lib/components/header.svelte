<script lang="ts">
    import Logo from '$lib/components/logo.svelte';
    import { page } from '$app/stores';
    import { AppBar, Avatar, popup, type DrawerSettings } from '@skeletonlabs/skeleton';
    import { drawerStore } from '@skeletonlabs/skeleton';
    import { getHeaderLinks } from '$lib/stores/links';
    import Fa from 'svelte-fa';
    import {
        faBars,
        faChevronDown,
        faGear,
        faDoorOpen,
        faHouse
    } from '@fortawesome/free-solid-svg-icons';
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
                class="btn outline-none"
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
                <a class="btn font-semibold" href={link.href}>{link.name}</a>
            {:else}
                <a class="btn" href={link.href}>{link.name}</a>
            {/if}
        {/each}
    </div>
    <svelte:fragment slot="trail">
        {#if user}
            <button
                aria-label="Profile"
                class="btn h-10 variant-filled shadow-sm px-2 bg-white text-surface-700 font-semibold text-sm dark:bg-surface-700 dark:text-surface-50 rounded-full xs:rounded-md grid grid-flow-col items-center p-0 m-0 gap-x-1 w-min"
                data-testid="profile-button"
                use:popup={{
                    event: 'click',
                    target: 'profile',
                    placement: 'bottom-end',
                    middleware: {
                        offset: {
                            mainAxis: 10,
                            crossAxis: -10
                        }
                    }
                }}
            >
                <Avatar initials={initials(user.name)} width="h-8" class="hidden xs:block" />
                <div class="h-8 w-4 relative flex justify-center items-center">
                    <span
                        class="absolute block xs:hidden text-center top-1/2 transform -translate-y-1/2 right-0.5"
                    >
                        {initials(user.name)}
                    </span>
                </div>
                <span class="hidden xs:block">{user.name}</span>
                <Fa
                    icon={faChevronDown}
                    size="12"
                    class="text-surface-700 dark:text-white hidden xs:block"
                />
            </button>
            <div
                class="card w-64 p-4 grid grid-flow-row rounded-xl shadow-xl text-surface-800 bg-white dark:text-white"
                data-popup="profile"
            >
                <nav class="list-nav grid grid-flow-row grid-cols-[1fr] p-0">
                    <ul>
                        <!-- Profile item -->
                        <li>
                            <a href="/account">
                                <div
                                    class="grid grid-cols-[auto_1fr] grid-rows-[1fr_1fr] gap-x-2 items-center"
                                >
                                    <div class="row-start-1 row-end-3 col-start-1">
                                        <Avatar initials={initials(user.name)} width="h-8" />
                                    </div>
                                    <span class="text-sm row-start-1 font-semibold"
                                        >{user.name}</span
                                    >
                                    <span
                                        class="text-xs row-start-2 text-gray-500 dark:text-gray-400"
                                        >{user.email}</span
                                    >
                                </div>
                            </a>
                        </li>

                        <hr />

                        <!-- Students -->
                        <p class="text-sm font-semibold">Students</p>

                        <li>
                            <a href="/home">
                                <Fa
                                    icon={faHouse}
                                    size="20"
                                    class="text-gray-500 dark:text-gray-200"
                                />
                                <span>Home</span>
                            </a>
                        </li>

                        <!-- Settings -->
                        <li>
                            <a href="/">
                                <Fa
                                    icon={faGear}
                                    size="20"
                                    class="text-gray-500 dark:text-gray-200"
                                />
                                <span>Settings</span>
                            </a>
                        </li>
                        <!-- Sign Out -->
                        <li>
                            <button aria-label="Sign Out" class="w-full" on:click={signOut}>
                                <Fa
                                    icon={faDoorOpen}
                                    size="20"
                                    class="text-gray-500 dark:text-gray-200"
                                />
                                <span>Sign Out</span>
                            </button>
                        </li>
                    </ul>
                </nav>
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
