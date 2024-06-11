<script lang="ts">
    import { goto } from '$app/navigation';
    import { navigating } from '$app/stores';
    import { initials } from '$lib/client/util';
    import * as Avatar from '$lib/components/ui/avatar/index';
    import { Button } from '$lib/components/ui/button';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
    import { type User, UserRole } from '$lib/models/types/database.types';
    import {
        faChevronDown,
        faDoorOpen,
        faHouse,
        faToolbox,
        faUser
    } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';

    export let user: User;

    let isOpen = false;
    $: if ($navigating) isOpen = false;

    const signOut = async () => {
        const res = await fetch('/auth/logout', {
            method: 'POST'
        });
        if (res.status === 200) {
            goto('/auth/login');
        }
    };
</script>

<DropdownMenu.Root bind:open={isOpen}>
    <DropdownMenu.Trigger asChild let:builder>
        <Button
            aria-label="Profile"
            builders={[builder]}
            class="grid grid-flow-col gap-x-2 bg-white hover:bg-gray-100"
            data-testid="profile-button"
        >
            <Avatar.Root class="m-0 h-6 w-6 p-0">
                <Avatar.Fallback class="bg-gray-200 text-black "
                    >{initials(user.userName)}</Avatar.Fallback
                >
            </Avatar.Root>
            <span class="hidden text-black xs:block">{user.userName}</span>
            <Fa class="text-black" icon={faChevronDown} size="sm" />
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <div class="grid w-64 grid-flow-row rounded-xl p-4 shadow-xl">
            <nav class="grid grid-flow-row grid-cols-[1fr] gap-y-2 p-0">
                <!-- Profile Summary -->
                <div class="grid grid-cols-[auto_1fr] grid-rows-[1fr_1fr] items-center gap-x-2">
                    <div class="col-start-1 row-start-1 row-end-3">
                        <Avatar.Root>
                            <Avatar.Fallback class="h-8 w-8 text-sm"
                                >{initials(user.userName)}</Avatar.Fallback
                            >
                        </Avatar.Root>
                    </div>
                    <span class="row-start-1 text-sm font-semibold" data-testid="profile-popup-name"
                        >{user.userName}</span
                    >
                    <span class="row-start-2 text-xs" data-testid="profile-popup-email"
                        >{user.userEmail}</span
                    >
                </div>

                <hr />

                <ul class="grid grid-flow-row gap-y-1">
                    {#if user.userRole.toString() === UserRole.ADMIN}
                        <div>
                            <p class="text-sm font-semibold">Admin</p>
                            <li class="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                                <a class="flex items-center gap-2" href="/admin">
                                    <Fa class="text-gray-500 dark:text-gray-200" icon={faToolbox} />
                                    <span>Admin Tools</span>
                                </a>
                            </li>
                        </div>
                    {/if}

                    <!-- Students -->
                    <div>
                        <p class="text-sm font-semibold">Students</p>

                        <li class="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <a class="flex items-center gap-2" href="/home">
                                <Fa class="text-gray-500 dark:text-gray-200" icon={faHouse} />
                                <span>Home</span>
                            </a>
                        </li>

                        <!-- Settings -->
                        <li class="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <a class="flex items-center gap-2" href="/profile">
                                <Fa class="text-gray-500 dark:text-gray-200" icon={faUser} />
                                <span>My Account</span>
                            </a>
                        </li>
                    </div>

                    <!-- Sign Out -->
                    <li class="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Button
                            aria-label="Sign Out"
                            class="flex items-center gap-2"
                            data-testid="sign-out-button"
                            on:click={signOut}
                        >
                            <Fa class="text-primary-foreground" icon={faDoorOpen} />
                            <span>Sign Out</span>
                        </Button>
                    </li>
                </ul>
            </nav>
        </div>
    </DropdownMenu.Content>
</DropdownMenu.Root>
