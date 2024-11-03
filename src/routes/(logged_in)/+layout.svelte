<script lang="ts">
    import type { User } from '$lib/models/types/database.types';

    import Header from '$lib/components/header.svelte';

    import type { LayoutData } from './$types';

    interface Props {
        data: LayoutData;
        children?: import('svelte').Snippet;
    }

    const { data, children }: Props = $props();
    const user = $derived(data.user as User);
</script>

<div data-testid="app-shell">
    <Header {user} />
    <div class="h-full p-4">
        {@render children?.()}
    </div>
</div>
