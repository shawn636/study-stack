<script lang="ts">
    import type { AfterNavigate } from '@sveltejs/kit';
    import type { LayoutData } from './$types';
    import type { User } from '$lib/models/types/database.types';

    import { afterNavigate } from '$app/navigation';
    import Footer from '$lib/components/footer.svelte';
    import Header from '$lib/components/header.svelte';

    interface Props {
        data: LayoutData;
        children?: import('svelte').Snippet;
    }

    const { data, children }: Props = $props();
    const user = $derived(data.user as User);

    afterNavigate((params: AfterNavigate) => {
        const isNewPage = params.from?.url.pathname !== params.to?.url.pathname;
        const elemPage = document.querySelector('#page');

        if (isNewPage && elemPage !== null) {
            elemPage.scrollTop = 0;
        }
    });
</script>

<div data-testid="app-shell">
    <Header {user} />
    {@render children?.()}
    <div class="bg-surface-100 dark:bg-surface-700"></div>
    <Footer />
</div>
