<script lang="ts">
	import CategoryCard from '$lib/components/category-card.svelte';
</script>

<div class="grid grid-flow-row justify-items-center items-center">
	<h3 class="text-md font-bold">Top Categories</h3>
	<p class="text-sm text-slate-500">Eu non ad elit irure minim enim Lorem</p>
</div>

<div class="grid grid-flow-col">
	{#each Array(6) as category}
		<CategoryCard />
	{/each}
</div>
