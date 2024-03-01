<script lang="ts">
    import type { PageServerData } from './$types';

    import Categories from './categories.svelte';
    import HeroBanner from './hero-banner.svelte';
    export let data: PageServerData;
</script>

<svelte:head>
    <title>Equipped Online Learning</title>

    <meta content="Svelte" name="twitter:title" />
    <meta content="Cybernetically enhanced web apps" name="twitter:description" />
    <meta content="Cybernetically enhanced web apps" name="Description" />
</svelte:head>
<HeroBanner />
<Categories categories={data.categories} />
