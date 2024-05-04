<script lang="ts">
    import type { User } from '$lib/models/types/database.types';

    import Header from '$lib/components/header.svelte';

    import type { LayoutData } from './$types';

    export let data: LayoutData;
    $: user = data.user as User;
</script>

<div data-testid="app-shell">
    <Header {user} />
    <div class="h-full p-4">
        <slot />
    </div>
</div>
