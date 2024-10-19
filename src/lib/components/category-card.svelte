<script lang="ts">
    import type CategorySummary from '$lib/models/types/category-summary';

    export let categorySummary: CategorySummary;

    const maxTitleLength = 25;
    $: categoryTitleShort =
        categorySummary.title.length > maxTitleLength
            ? `${categorySummary.title.slice(0, maxTitleLength)}...`
            : categorySummary.title;
</script>

<a
    class="bg-surface-50 grid h-full w-40 grid-flow-row items-center justify-items-center rounded-lg border border-slate-100 p-4 text-center shadow-sm ring-0 transition-transform hover:scale-105 dark:border-none dark:bg-slate-800"
    href="/categories"
>
    <div class="m-0 grid items-center justify-items-center rounded-full bg-white p-0 shadow-sm">
        <img alt={categoryTitleShort} class="m-0 h-20 w-20 p-4" src={categorySummary.imgHref} />
    </div>
    <div class="grid grid-flow-row p-0">
        <h4 class="font-bold">{categoryTitleShort}</h4>
        <p class="text-surface-800-100-token text-sm">{categorySummary.count}+ Courses</p>
    </div>
</a>
