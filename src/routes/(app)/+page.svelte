<script lang="ts">
    import Categories from './categories.svelte';
    import HeroBanner from './hero-banner.svelte';
    import type { PageServerData } from './$types';
    export let data: PageServerData;
</script>

<svelte:head>
    <title>Equipped Online Learning</title>

    <meta name="twitter:title" content="Svelte" />
    <meta name="twitter:description" content="Cybernetically enhanced web apps" />
    <meta name="Description" content="Cybernetically enhanced web apps" />
</svelte:head>
<HeroBanner />
<Categories categories={data.categories} />
