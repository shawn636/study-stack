<script lang="ts">
    import Sidebar from '$lib/components/sidebar.svelte';
    import Header from '$lib/components/header.svelte';
    import { AppShell, Toast } from '@skeletonlabs/skeleton';
    import type { LayoutData } from './$types';
    import type User from '$lib/models/user';

    export let data: LayoutData;
    $: user = data.user as User;
</script>

<Toast />
<Sidebar {user} />
<AppShell slotPageFooter="bg-surface-100 dark:bg-surface-700">
    <svelte:fragment slot="header">
        <Header {user} />
    </svelte:fragment>

    <div class="h-full p-4 bg-surface-50 dark:bg-surface-900">
        <slot />
    </div>
</AppShell>
