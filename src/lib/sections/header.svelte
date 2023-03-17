<script lang="ts">
	import Logo from '$lib/components/logo.svelte';
	import Sidebar from '$lib/components/sidebar.svelte';
	import type Link from '$lib/models/link';
	import { page } from '$app/stores';
	import { Bars3 } from 'svelte-heros';
	import { sidebarStore } from '$lib/stores/sidebar';
	import { clickOutside } from 'svelte-use-click-outside';

	const headerLinks: Array<Link> = [
		{ name: 'Home', href: '/' },
		{ name: 'Find Courses', href: '/find-courses' },
		{ name: 'Create a Course', href: '/create-course' },
		{ name: 'About', href: '/about' }
	];

	const handleClickOutside = () => {
		if ($sidebarStore == true) {
			sidebarStore.toggle();
		}
	};
</script>

<div class="h-12 bg-light-blue-800 grid grid-flow-col items-center justify-items-center">
	<div class="justify-self-start">
		<Logo />
	</div>
	<div class="grid-flow-col items-center hidden md:grid gap-x-5">
		{#each headerLinks as link}
			{#if $page.url.pathname == link.href}
				<p class="font-bold text-white">{link.name}</p>
			{:else}
				<a class="text-white" href="#top">{link.name}</a>
			{/if}
		{/each}
	</div>
	<div class="justify-self-end grid grid-flow-col px-2 items-center">
		<a class="hidden xs:block hover:text-gray-200 font-semibold text-white pr-5" href="#top"
			>Sign In</a
		>
		<a
			class="hidden xs:block rounded-xl bg-white px-5 py-1.5 text-light-blue-900 font-semibold hover:shadow-md"
			href="#top"
		>
			Get Started
		</a>

		<div use:clickOutside={handleClickOutside}>
			<button on:click={sidebarStore.toggle}>
				<Bars3 class="grid md:hidden ml-2" color="white" size="32" />
			</button>

			<Sidebar bind:open={$sidebarStore} links={headerLinks} />
		</div>
	</div>
</div>
