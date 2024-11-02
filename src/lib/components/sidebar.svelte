<script lang="ts">
    import type { User } from '$lib/models/types/database.types';

    import { getHeaderLinks } from '$lib/stores/links';
    import Logo from '$lib/components/logo.svelte';

    interface Props {
        user?: User | null | undefined;
    }

    let { user = null }: Props = $props();
    let headerLinks = $derived(getHeaderLinks(user === null ? false : true));
</script>

<div class="flex h-full w-full flex-col">
    <a class="flex" href="/"><Logo colorClass="text-primary" /></a>
    <nav class="flex flex-col gap-y-2">
        {#each headerLinks as link}
            <a class="flex-auto px-2" href={link.href}>{link.name}</a>
        {/each}
    </nav>
</div>
