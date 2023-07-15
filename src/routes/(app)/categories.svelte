<script lang="ts">
    import CategoryCard from '$lib/components/category-card.svelte';
    import type Category from '$lib/models/category';
    export let categories: Category[];
</script>

<div class="grid justify-items-center">
    <div class="items-center pb-4 grid grid-flow-row justify-items-center max-w-7xl">
        <h3 class="font-bold text-md">Top Categories</h3>
        <p class="text-sm text-slate-500">Eu non ad elit irure minim enim Lorem</p>
    </div>

    <div
        class="pb-8 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-6 gap-8 max-w-7xl"
    >
        {#each categories as category, index}
            <span data-testid="category-card-{index}">
                <CategoryCard {category} />
            </span>
        {/each}
    </div>
</div>
