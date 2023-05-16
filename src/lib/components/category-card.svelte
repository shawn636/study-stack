<script lang="ts">
	import type Category from '$lib/models/category';

	export let category: Category;
</script>

<div
	class="bg-surface-400/50 rounded-xl w-40 h-full p-2 hover:shadow-md hover:scale-105 transition-all ease-in-out duration-300"
>
	<div class="grid grid-flow-row text-center justify-items-center p-2 items-center min-h-full">
		<div class="rounded-full bg-white grid justify-items-center items-center m-0 p-0 shadow-sm">
			<img src={category.img_href} alt={category.title} class="w-20 h-20 p-4 m-0" />
		</div>
		<div class="grid grid-flow-row p-0">
			<h4 class="font-bold">{category.title}</h4>
			<p class="text-sm text-surface-800-100-token">{category.count}+ Courses</p>
		</div>
	</div>
</div>
