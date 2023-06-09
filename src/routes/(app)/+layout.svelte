<script lang="ts">
    import Sidebar from '$lib/components/sidebar.svelte';
    import Header from '$lib/sections/header.svelte';
    import Footer from '$lib/sections/footer.svelte';
    import { AppShell } from '@skeletonlabs/skeleton';
    import type { LayoutData } from './$types';
    import type User from '$lib/models/user';

    export let data: LayoutData;
    $: user = data.user as User;
</script>

<Sidebar {user} />
<AppShell slotPageFooter="bg-surface-100 dark:bg-surface-700">
    <svelte:fragment slot="header">
        <Header {user} />
    </svelte:fragment>

    <slot />

    <svelte:fragment slot="pageFooter">
        <Footer />
    </svelte:fragment>
</AppShell>
