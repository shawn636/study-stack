<script lang="ts">
	import Categories from '$lib/sections/categories.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<div class="grid grid-flow-row p-5">
	<h1 class="text-2xl font-medium pb-10">Currently In Development</h1>
	<div class="border-pink-500 border border-dashed">
		<Categories categories={data.categories} />
	</div>
</div>
