<script lang="ts">
	export let color = 'white';
	export let layout: 'horizontal' | 'vertical' = 'horizontal';
</script>

<div
	class="items-center p-2 grid grid-flow-{layout === 'horizontal'
		? 'col'
		: 'row'} justify-items-center gap-x-2"
>
	<div class="w-8 h-8 bg-surface-400 rounded-md" />
	<p class="text-lg font-medium text-{color}">Equipped</p>
</div>
