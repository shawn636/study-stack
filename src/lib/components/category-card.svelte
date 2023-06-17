<script lang="ts">
    import type Category from '$lib/models/category';

    export let category: Category;
</script>

<a
    href="/categories"
    class="card card-hover bg-surface-50 w-40 h-full grid grid-flow-row text-center justify-items-center p-4 items-center ring-0"
>
    <div class="rounded-full bg-white grid justify-items-center items-center m-0 p-0 shadow-sm">
        <img src={category.img_href} alt={category.title} class="w-20 h-20 p-4 m-0" />
    </div>
    <div class="grid grid-flow-row p-0">
        <h4 class="font-bold">{category.title}</h4>
        <p class="text-sm text-surface-800-100-token">{category.count}+ Courses</p>
    </div>
</a>
