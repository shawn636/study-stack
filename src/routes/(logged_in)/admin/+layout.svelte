<script lang="ts">
    import { faBox, faChartLine, faGear, faHome, faUsers } from '@fortawesome/free-solid-svg-icons';

    import { Separator } from '$lib/components/ui/separator';
    import SidebarNav from '$lib/components/collapsible-sidebar/sidebar-nav.svelte';
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    const sidebarNavItems = [
        {
            href: '/admin',
            icon: faHome,
            title: 'Dashboard'
        },
        {
            href: '/admin/users',
            icon: faUsers,
            title: 'Users'
        },
        {
            href: '/admin/content',
            icon: faBox,
            title: 'Content'
        },
        {
            href: '/admin/settings',
            icon: faGear,
            title: 'Settings'
        },
        {
            href: '/admin/analytics',
            icon: faChartLine,
            title: 'Analytics'
        }
    ];
</script>

<div class="space-y-6 p-4 pb-16">
    <div class="space-y-0.5">
        <h2 class="text-2xl font-bold tracking-tight">Admin Panel</h2>
        <p class="text-muted-foreground">Manage users, content, and settings.</p>
    </div>
    <Separator class="my-6" />
    <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside class="lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
        </aside>
        <div class="flex-grow lg:flex lg:justify-center">
            <div class="w-full max-w-7xl">
                {@render children?.()}
            </div>
        </div>
    </div>
</div>
