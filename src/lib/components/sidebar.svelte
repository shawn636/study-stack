<script lang="ts">
	import type Link from '$lib/models/link';

	export let links: Array<Link>;
	export let open = false;
</script>

<aside class="fixed right-0 w-48 h-full shadow-lg md:hidden top-12 bg-light-blue-800" class:open>
	<nav class="grid grid-flow-row">
		{#each links as link}
			<a href={'#top'} class="px-5 py-1 my-1 text-white hover:bg-light-blue-600">{link.name}</a>
		{/each}
		<a
			class="xs:hidden mx-5 my-2 rounded-xl bg-white px-5 py-1.5 text-center text-light-blue-900 font-semibold hover:shadow-lg transition"
			href="#top"
		>
			Get Started
		</a>
		<a
			class="pr-5 mx-5 my-2 font-semibold text-white xs:hidden hover:text-gray-200 justify-self-center transition"
			href="#top"
		>
			Sign In
		</a>
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
