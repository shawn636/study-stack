<script lang="ts">
	import type Category from '$lib/models/category';

	export let category: Category;
</script>

<div class="bg-slate-200 rounded-xl w-40 p-2">
	<div class="grid grid-flow-row text-center justify-items-center p-2 items-center min-h-full">
		<div class="rounded-full bg-white grid justify-items-center items-center m-0 p-0 shadow-sm">
			<img src={category.img_href} alt={category.title} class="w-20 h-20 p-4 m-0" />
		</div>
		<div class="grid grid-flow-row p-0">
			<h4 class="font-bold text-slate-800">{category.title}</h4>
			<p class="text-sm text-gray-500">{category.count}+ Courses</p>
		</div>
	</div>
</div>
