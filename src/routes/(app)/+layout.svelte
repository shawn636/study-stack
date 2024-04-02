<script lang="ts">
    import type { User } from '$lib/models/database.types';

    import Footer from '$lib/components/footer.svelte';
    import Header from '$lib/components/header.svelte';
    import Sidebar from '$lib/components/sidebar.svelte';
    import { scrollHandler } from '$lib/stores/scroll';
    import { AppShell, Toast } from '@skeletonlabs/skeleton';

    import type { LayoutData } from './$types';

    export let data: LayoutData;
    $: user = data.user as User;
</script>

<Toast />
<Sidebar {user} />
<AppShell on:scroll={scrollHandler} slotPageFooter="bg-surface-100 dark:bg-surface-700">
    <svelte:fragment slot="header">
        <Header {user} />
    </svelte:fragment>

    <slot />

    <svelte:fragment slot="pageFooter">
        <Footer />
    </svelte:fragment>
</AppShell>
