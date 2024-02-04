<script lang="ts">
    import type User from '$lib/models/user';

    import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
    import { initials } from '$lib/client/util';
    import Fa from 'svelte-fa';
    import { faChevronDown, faDoorOpen, faHouse, faUser } from '@fortawesome/free-solid-svg-icons';
    import { goto } from '$app/navigation';

    export let user: User;

    let is_open = false;

    const signOut = async () => {
        const res = await fetch('/auth/logout', {
            method: 'POST'
        });
        if (res.status == 200) {
            console.log(res.status);
            goto('/auth/login');
        }
    };

    const popup_settings: PopupSettings = {
        event: 'click',
        target: 'profile',
        placement: 'bottom-end',
        middleware: {
            offset: {
                mainAxis: 10,
                crossAxis: -10
            }
        },
        state: (e: Record<string, boolean>) => {
            is_open = e.state;
        }
    };
</script>

<!-- Profile Button -->
<button
    aria-label="Profile"
    aria-expanded={is_open}
    class="grid items-center h-10 grid-flow-col p-0 px-2 m-0 text-sm font-semibold bg-white shadow-sm btn variant-filled text-surface-700 dark:bg-surface-700 dark:text-surface-50 xs:rounded-md gap-x-1 w-min"
    data-testid="profile-button"
    use:popup={popup_settings}
>
    <Avatar initials={initials(user.name)} width="w-8" />
    <span class="hidden xs:block">{user.name}</span>
    <Fa icon={faChevronDown} size="sm" class="text-surface-700 dark:text-white xs:block" />
</button>

<!-- Pop Up Menu -->

<div data-popup="profile">
    <div
        class="grid w-64 grid-flow-row p-4 bg-white shadow-xl card rounded-xl text-surface-800 dark:text-white z-10"
    >
        <nav class="list-nav grid grid-flow-row grid-cols-[1fr] p-0 gap-y-2">
            <!-- Profile Summary -->
            <div class="grid grid-cols-[auto_1fr] grid-rows-[1fr_1fr] gap-x-2 items-center">
                <div class="col-start-1 row-start-1 row-end-3">
                    <Avatar
                        initials={initials(user.name)}
                        width="w-8"
                        height="h-8"
                        text_style="text-sm"
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
                        <Fa icon={faHouse} size="lg" class="text-gray-500 dark:text-gray-200" />
                        <span>Home</span>
                    </a>
                </li>

                <!-- Settings -->
                <li>
                    <a href="/account">
                        <Fa icon={faUser} size="lg" class="text-gray-500 dark:text-gray-200" />
                        <span>My Account</span>
                    </a>
                </li>
                <!-- Sign Out -->
                <li>
                    <button aria-label="Sign Out" class="w-full" on:click={signOut}>
                        <Fa icon={faDoorOpen} size="lg" class="text-gray-500 dark:text-gray-200" />
                        <span>Sign Out</span>
                    </button>
                </li>
            </ul>
        </nav>
    </div>
</div>
