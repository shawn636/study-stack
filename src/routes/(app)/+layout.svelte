<script lang="ts">
    import type { User } from '$lib/models/types/database.types';
    import type { AfterNavigate } from '@sveltejs/kit';

    import { afterNavigate } from '$app/navigation';
    import Footer from '$lib/components/footer.svelte';
    import Header from '$lib/components/header.svelte';
    // import Sidebar from '$lib/components/sidebar.svelte';
    // import { Toast } from '@skeletonlabs/skeleton';

    import type { LayoutData } from './$types';

    export let data: LayoutData;
    $: user = data.user as User;

    afterNavigate((params: AfterNavigate) => {
        const isNewPage = params.from?.url.pathname !== params.to?.url.pathname;
        const elemPage = document.querySelector('#page');

        if (isNewPage && elemPage !== null) {
            elemPage.scrollTop = 0;
        }
    });
</script>

<!-- <Toast />
<Sidebar {user} /> -->

<div data-testid="app-shell">
    <Header {user} />
    <slot />
    <div class="bg-surface-100 dark:bg-surface-700"></div>
    <Footer />
</div>
