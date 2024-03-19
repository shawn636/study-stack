<script lang="ts">
    import type CategorySummary from '$lib/models/category-summary';

    export let categorySummary: CategorySummary;
</script>

<a
    class="card card-hover grid h-full w-40 grid-flow-row items-center justify-items-center bg-surface-50 p-4 text-center ring-0"
    href="/categories"
>
    <div class="m-0 grid items-center justify-items-center rounded-full bg-white p-0 shadow-sm">
        <img alt={categorySummary.title} class="m-0 h-20 w-20 p-4" src={categorySummary.imgHref} />
    </div>
    <div class="grid grid-flow-row p-0">
        <h4 class="font-bold">{categorySummary.title}</h4>
        <p class="text-surface-800-100-token text-sm">{categorySummary.count}+ Courses</p>
    </div>
</a>
