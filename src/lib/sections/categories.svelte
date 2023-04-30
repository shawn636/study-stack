<script lang="ts">
	import CategoryCard from '$lib/components/category-card.svelte';
	import type Category from '$lib/models/category';
	export let categories: Category[];
</script>

<div class="grid justify-items-center">
	<div class="grid grid-flow-row justify-items-center items-center pb-4 max-w-7xl">
		<h3 class="text-md font-bold">Top Categories</h3>
		<p class="text-sm text-slate-500">Eu non ad elit irure minim enim Lorem</p>
	</div>

	<div
		class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl"
	>
		{#each categories as category, index}
			<span data-testid="category-card-{index}">
				<CategoryCard {category} />
			</span>
		{/each}
	</div>
</div>
