<script lang="ts">
    import type User from '$lib/models/user';

    import { Avatar, popup } from '@skeletonlabs/skeleton';
    import { initials } from '$lib/client/util';
    import Fa from 'svelte-fa';
    import { faChevronDown, faDoorOpen, faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
    import { goto } from '$app/navigation';

    export let user: User;

    const signOut = async () => {
        const res = await fetch('/auth/logout', {
            method: 'POST'
        });
        if (res.status == 200) {
            console.log(res.status);
            goto('/auth/login');
        }
    };
</script>

<!-- Profile Button -->
<button
    aria-label="Profile"
    class="items-center h-10 p-0 px-2 m-0 text-sm font-semibold bg-white rounded-full btn variant-filled shadow-sm text-surface-700 dark:bg-surface-700 dark:text-surface-50 xs:rounded-md grid grid-flow-col gap-x-1 w-min"
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
    <div class="relative flex items-center justify-center w-4 h-8">
        <span
            class="absolute block xs:hidden text-center top-1/2 transform -translate-y-1/2 right-0.5"
        >
            {initials(user.name)}
        </span>
    </div>
    <span class="hidden xs:block">{user.name}</span>
    <Fa icon={faChevronDown} size="12" class="hidden text-surface-700 dark:text-white xs:block" />
</button>

<!-- Pop Up Menu -->
<div
    class="w-64 p-4 bg-white shadow-xl card grid grid-flow-row rounded-xl text-surface-800 dark:text-white"
    data-popup="profile"
>
    <nav class="list-nav grid grid-flow-row grid-cols-[1fr] p-0 gap-y-2">
        <!-- Profile Summary -->
        <div class="grid grid-cols-[auto_1fr] grid-rows-[1fr_1fr] gap-x-2 items-center">
            <div class="row-start-1 row-end-3 col-start-1">
                <Avatar initials={initials(user.name)} width="h-8" />
            </div>
            <span class="text-sm font-semibold row-start-1">{user.name}</span>
            <span class="text-xs text-gray-500 row-start-2 dark:text-gray-400">{user.email}</span>
        </div>

        <hr />

        <ul>
            <!-- Students -->
            <p class="text-sm font-semibold">Students</p>

            <li>
                <a href="/home">
                    <Fa icon={faHouse} size="20" class="text-gray-500 dark:text-gray-200" />
                    <span>Home</span>
                </a>
            </li>

            <!-- Settings -->
            <li>
                <a href="/account">
                    <Fa icon={faUser} size="20" class="text-gray-500 dark:text-gray-200" />
                    <span>My Account</span>
                </a>
            </li>
            <!-- Sign Out -->
            <li>
                <button aria-label="Sign Out" class="w-full" on:click={signOut}>
                    <Fa icon={faDoorOpen} size="20" class="text-gray-500 dark:text-gray-200" />
                    <span>Sign Out</span>
                </button>
            </li>
        </ul>
    </nav>
</div>
