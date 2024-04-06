<script lang="ts">
    import type { User } from '$lib/models/types/database.types';

    import Header from '$lib/components/header.svelte';
    import Sidebar from '$lib/components/sidebar.svelte';
    import { AppShell, Toast } from '@skeletonlabs/skeleton';

    import type { LayoutData } from './$types';

    export let data: LayoutData;
    $: user = data.user as User;
</script>

<Toast />
<Sidebar {user} />
<AppShell slotPageFooter="bg-surface-100 dark:bg-surface-700">
    <svelte:fragment slot="header">
        <Header {user} />
    </svelte:fragment>

    <div class="h-full bg-surface-50 p-4 dark:bg-surface-900">
        <slot />
    </div>
</AppShell>
