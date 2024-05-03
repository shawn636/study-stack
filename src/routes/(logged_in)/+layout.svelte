<script lang="ts">
    import type { User } from '$lib/models/types/database.types';

    import Header from '$lib/components/header.svelte';
    // import Sidebar from '$lib/components/sidebar.svelte';
    // import { Toast } from '@skeletonlabs/skeleton';

    import type { LayoutData } from './$types';

    export let data: LayoutData;
    $: user = data.user as User;
</script>

<!-- <Toast /> -->
<!-- <Sidebar {user} /> -->

<div data-testid="app-shell">
    <Header {user} />
    <div class="bg-surface-50 dark:bg-surface-900 h-full p-4">
        <slot />
    </div>
</div>
