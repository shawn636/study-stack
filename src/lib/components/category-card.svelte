<script lang="ts">
    import type Category from '$lib/models/category';

    export let category: Category;
</script>

<a
    class="card card-hover grid h-full w-40 grid-flow-row items-center justify-items-center bg-surface-50 p-4 text-center ring-0"
    href="/categories"
>
    <div class="m-0 grid items-center justify-items-center rounded-full bg-white p-0 shadow-sm">
        <img alt={category.title} class="m-0 h-20 w-20 p-4" src={category.img_href} />
    </div>
    <div class="grid grid-flow-row p-0">
        <h4 class="font-bold">{category.title}</h4>
        <p class="text-surface-800-100-token text-sm">{category.count}+ Courses</p>
    </div>
</a>
