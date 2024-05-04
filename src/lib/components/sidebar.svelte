<script lang="ts">
    import type { User } from '$lib/models/types/database.types';

    import Logo from '$lib/components/logo.svelte';
    import { getHeaderLinks } from '$lib/stores/links';

    // $: classesActive = (href: string) =>
    //     href === $page.url.pathname ? '!bg-equipped-blue !text-white rounded' : '';

    export let user: User | null | undefined = null;
    $: headerLinks = getHeaderLinks(user === null ? false : true);
</script>

<div class="flex h-full w-full flex-col">
    <a class="flex" href="/"><Logo colorClass="text-primary" /></a>
    <nav class="flex flex-col gap-y-2">
        {#each headerLinks as link}
            <a class="flex-auto px-2" href={link.href}>{link.name}</a>
        {/each}
    </nav>
</div>
