<script lang="ts">
	import Categories from '$lib/sections/categories.svelte';
	import HeroBanner from '$lib/sections/hero-banner.svelte';
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
