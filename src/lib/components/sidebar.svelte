<script lang="ts">
	import type Link from '$lib/models/link';

	export let open = false;
	export let links: Array<Link>;
</script>

<aside class="md:hidden right-0 top-12 absolute w-64 h-full bg-blue-400" class:open>
	<nav class="grid grid-flow-row">
		{#each links as link}
			<a href={link.href}>{link.name}</a>
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
