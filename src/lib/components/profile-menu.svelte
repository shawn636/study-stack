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
    <Fa icon={faChevronDown} size="12" class="text-surface-700 dark:text-white hidden xs:block" />
</button>

<!-- Pop Up Menu -->
<div
    class="card w-64 p-4 grid grid-flow-row rounded-xl shadow-xl text-surface-800 bg-white dark:text-white"
    data-popup="profile"
>
    <nav class="list-nav grid grid-flow-row grid-cols-[1fr] p-0 gap-y-2">
        <!-- Profile Summary -->
        <div class="grid grid-cols-[auto_1fr] grid-rows-[1fr_1fr] gap-x-2 items-center">
            <div class="row-start-1 row-end-3 col-start-1">
                <Avatar initials={initials(user.name)} width="h-8" />
            </div>
            <span class="text-sm row-start-1 font-semibold">{user.name}</span>
            <span class="text-xs row-start-2 text-gray-500 dark:text-gray-400">{user.email}</span>
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
