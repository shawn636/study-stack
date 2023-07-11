<script lang="ts">
    import type Category from '$lib/models/category';

    export let category: Category;
</script>

<a
    href="/categories"
    class="items-center w-40 h-full p-4 text-center card card-hover bg-surface-50 grid grid-flow-row justify-items-center ring-0"
>
    <div class="items-center p-0 m-0 bg-white rounded-full grid justify-items-center shadow-sm">
        <img src={category.img_href} alt={category.title} class="w-20 h-20 p-4 m-0" />
    </div>
    <div class="p-0 grid grid-flow-row">
        <h4 class="font-bold">{category.title}</h4>
        <p class="text-sm text-surface-800-100-token">{category.count}+ Courses</p>
    </div>
</a>
