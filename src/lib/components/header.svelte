<script lang="ts">
    import type { User } from '$lib/models/types/database.types';

    import { page } from '$app/stores';
    import { navigating } from '$app/stores';
    import Logo from '$lib/components/logo.svelte';
    import ProfileMenu from '$lib/components/profile-menu.svelte';
    import { Button } from '$lib/components/ui/button';
    import * as Sheet from '$lib/components/ui/sheet/index';
    import { getHeaderLinks } from '$lib/stores/links';
    import { faBars } from '@fortawesome/free-solid-svg-icons';
    import Fa from 'svelte-fa';
    export let user: User | undefined;

    $: headerLinks = getHeaderLinks(user === undefined ? false : true);

    let sidebarOpen = false;
    $: if ($navigating) sidebarOpen = false;
</script>

<div
    class="grid grid-cols-[auto_1fr_auto] items-center bg-equipped-blue px-4"
    data-testid="app-bar"
>
    <div class="flex-flow-col flex items-center justify-self-start">
        <Sheet.Root bind:open={sidebarOpen}>
            <Sheet.Trigger asChild let:builder>
                <Button
                    builders={[builder]}
                    class="mx-0 flex border-none bg-transparent px-0 outline-none hover:bg-transparent focus:border-none focus:outline-none md:hidden"
                    size="icon"
                    variant="outline"
                >
                    <Fa class="text-white" icon={faBars} size="lg" />
                </Button>
            </Sheet.Trigger>
            <Sheet.Content side="left">
                <div class="flex h-full w-full flex-col gap-y-2">
                    <a class="flex" href="/"><Logo colorClass="text-primary" /></a>
                    <nav class="flex flex-col gap-y-2">
                        {#each headerLinks as link}
                            <a class="flex-auto px-2" href={link.href}>{link.name}</a>
                        {/each}
                    </nav>

                    {#if !user}
                        <div class="flex flex-col gap-y-2">
                            <Button class="w-full" href="/auth/login" variant="secondary">
                                Sign In
                            </Button>
                            <Button class="variant-filled w-full" href="/auth/register">
                                Register
                            </Button>
                        </div>
                    {/if}
                </div>
            </Sheet.Content>
        </Sheet.Root>
        <a class="justify-self-start" href="/"><Logo colorClass="text-white" /></a>
    </div>
    <div
        class="hidden grid-flow-col items-center justify-items-center justify-self-center text-white md:grid"
    >
        {#each headerLinks as link}
            {#if $page.url.pathname === link.href}
                <Button class="font-bold text-white" href={link.href} role="link" variant="link"
                    >{link.name}</Button
                >
            {:else}
                <Button class="text-white" href={link.href} role="link" variant="link"
                    >{link.name}</Button
                >
            {/if}
        {/each}
    </div>
    <div class="justify-self-end">
        {#if user}
            <ProfileMenu {user} />
        {:else}
            <div class="grid grid-flow-col items-center gap-x-4 px-2">
                <Button class="hidden xs:flex" href="/auth/login" role="link" variant="secondary"
                    >Sign In</Button
                >
                <Button href="/auth/register" role="link">Get Started</Button>
            </div>
        {/if}
    </div>
</div>
