<script lang="ts">
    import type { User } from '@prisma/client';

    import { goto } from '$app/navigation';
    import { initials } from '$lib/client/util';
    import { faChevronDown, faDoorOpen, faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
    import { Avatar, type PopupSettings, popup } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa';

    export let user: User;

    let isOpen = false;

    const signOut = async () => {
        const res = await fetch('/auth/logout', {
            method: 'POST'
        });
        if (res.status === 200) {
            goto('/auth/login');
        }
    };

    const popupSettings: PopupSettings = {
        event: 'click',
        middleware: {
            offset: {
                crossAxis: -10,
                mainAxis: 10
            }
        },
        placement: 'bottom-end',
        state: (e: Record<string, boolean>) => {
            isOpen = e.state;
        },
        target: 'profile'
    };
</script>

<!-- Profile Button -->
<button
    aria-expanded={isOpen}
    aria-label="Profile"
    class="variant-filled btn m-0 grid h-10 w-min grid-flow-col items-center gap-x-1 bg-white p-0 px-2 text-sm font-semibold text-surface-700 shadow-sm dark:bg-surface-700 dark:text-surface-50 xs:rounded-md"
    data-testid="profile-button"
    use:popup={popupSettings}
>
    <Avatar initials={initials(user.name)} width="w-8" />
    <span class="hidden xs:block">{user.name}</span>
    <Fa class="text-surface-700 dark:text-white xs:block" icon={faChevronDown} size="sm" />
</button>

<!-- Pop Up Menu -->

<div data-popup="profile">
    <div
        class="card z-10 grid w-64 grid-flow-row rounded-xl bg-white p-4 text-surface-800 shadow-xl dark:text-white"
    >
        <nav class="list-nav grid grid-flow-row grid-cols-[1fr] gap-y-2 p-0">
            <!-- Profile Summary -->
            <div class="grid grid-cols-[auto_1fr] grid-rows-[1fr_1fr] items-center gap-x-2">
                <div class="col-start-1 row-start-1 row-end-3">
                    <Avatar
                        height="h-8"
                        initials={initials(user.name)}
                        textStyle="text-sm"
                        width="w-8"
                    />
                </div>
                <span class="row-start-1 text-sm font-semibold" data-testid="profile-popup-name"
                    >{user.name}</span
                >
                <span
                    class="row-start-2 text-xs text-gray-500 dark:text-gray-400"
                    data-testid="profile-popup-email">{user.email}</span
                >
            </div>

            <hr />

            <ul>
                <!-- Students -->
                <p class="text-sm font-semibold">Students</p>

                <li>
                    <a href="/home">
                        <Fa class="text-gray-500 dark:text-gray-200" icon={faHouse} size="lg" />
                        <span>Home</span>
                    </a>
                </li>

                <!-- Settings -->
                <li>
                    <a href="/account">
                        <Fa class="text-gray-500 dark:text-gray-200" icon={faUser} size="lg" />
                        <span>My Account</span>
                    </a>
                </li>
                <!-- Sign Out -->
                <li>
                    <button aria-label="Sign Out" class="w-full" on:click={signOut}>
                        <Fa class="text-gray-500 dark:text-gray-200" icon={faDoorOpen} size="lg" />
                        <span>Sign Out</span>
                    </button>
                </li>
            </ul>
        </nav>
    </div>
</div>
