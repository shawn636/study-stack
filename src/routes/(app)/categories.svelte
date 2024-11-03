<script lang="ts">
    import type CategorySummary from '$lib/models/types/category-summary';

    import CategoryCard from '$lib/components/category-card.svelte';
    interface Props {
        categorySummaries: CategorySummary[];
    }

    const { categorySummaries }: Props = $props();
</script>

<div class="mt-4 grid justify-items-center">
    <div class="grid max-w-7xl grid-flow-row items-center justify-items-center pb-4">
        <h3 class="text-md font-bold">Top Categories</h3>
        <p class="text-sm text-slate-500">Eu non ad elit irure minim enim Lorem</p>
    </div>

    <div
        class="grid max-w-7xl grid-cols-1 gap-8 pb-8 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-6"
    >
        {#each categorySummaries as categorySummary, index}
            <span data-testid="category-card-{index}">
                <CategoryCard {categorySummary} />
            </span>
        {/each}
    </div>
</div>
