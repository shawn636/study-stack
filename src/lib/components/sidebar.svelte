<script lang="ts">
	import type Link from '$lib/models/link';

	export let links: Array<Link>;
	export let open = false;
</script>

<aside class="md:hidden right-0 fixed top-12 w-48 h-full bg-light-blue-800 shadow-lg" class:open>
	<nav class="grid grid-flow-row p-5">
		{#each links as link}
			<a href={'#top'} class="text-white">{link.name}</a>
		{/each}
	</nav>
</aside>

<style>
	aside {
		right: -100%;
		transition: right 0.3s ease-in-out;
	}
	.open {
		right: 0;
	}
</style>
