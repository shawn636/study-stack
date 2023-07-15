<script lang="ts">
    import type { LayoutData } from './$types';
    import type User from '$lib/models/user';

    import Sidebar from '$lib/components/sidebar.svelte';
    import Header from '$lib/components/header.svelte';
    import Footer from '$lib/components/footer.svelte';
    import { AppShell, Toast } from '@skeletonlabs/skeleton';
    import { scrollHandler } from '$lib/stores/scroll';

    export let data: LayoutData;
    $: user = data.user as User;
</script>

<Toast />
<Sidebar {user} />
<AppShell slotPageFooter="bg-surface-100 dark:bg-surface-700" on:scroll={scrollHandler}>
    <svelte:fragment slot="header">
        <Header {user} />
    </svelte:fragment>

    <slot />

    <svelte:fragment slot="pageFooter">
        <Footer />
    </svelte:fragment>
</AppShell>
