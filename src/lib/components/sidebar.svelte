<script lang="ts">
	import type Link from '$lib/models/link';

	export let links: Array<Link>;
	export let open = false;
</script>

<aside class="md:hidden right-0 fixed top-12 w-48 h-full bg-light-blue-800 shadow-lg" class:open>
	<nav class="grid grid-flow-row">
		{#each links as link}
			<a href={'#top'} class="text-white px-5 py-1 my-1 hover:bg-light-blue-600">{link.name}</a>
		{/each}
		<a
			class="xs:hidden mx-5 my-2 rounded-xl bg-white px-5 py-1.5 text-center text-light-blue-900 font-semibold hover:shadow-lg transition"
			href="#top"
		>
			Get Started
		</a>
		<a
			class="xs:hidden mx-5 hover:text-gray-200 justify-self-center my-2 font-semibold text-white pr-5 transition"
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
