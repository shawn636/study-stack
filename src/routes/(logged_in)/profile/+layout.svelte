<script lang="ts">
    import SidebarNav from '$lib/components/collapsible-sidebar/sidebar-nav.svelte';
    import { Separator } from '$lib/components/ui/separator';

    const sidebarNavItems = [
        {
            href: '/profile',
            icon: undefined,
            title: 'Profile'
        },
        {
            href: '/profile/account',
            icon: undefined,
            title: 'Account'
        },
        {
            href: '/profile/appearance',
            icon: undefined,
            title: 'Appearance'
        },
        {
            href: '/profile/notifications',
            icon: undefined,
            title: 'Notifications'
        },
        {
            href: '/profile/display',
            icon: undefined,
            title: 'Display'
        }
    ];
</script>

<div class="space-y-6 p-10 pb-16">
    <div class="space-y-0.5">
        <h2 class="text-2xl font-bold tracking-tight">Settings</h2>
        <p class="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
        </p>
    </div>
    <Separator class="my-6" />
    <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside class="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
        </aside>

        <div class="flex-1 lg:max-w-2xl">
            <slot />
        </div>
    </div>
</div>
