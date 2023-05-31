<script lang="ts">
	import Logo from '$lib/components/logo.svelte';
	import { page } from '$app/stores';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { drawerStore } from '@skeletonlabs/skeleton';
	import { getHeaderLinks } from '$lib/header-links';
	import Fa from 'svelte-fa';
	import { faBars } from '@fortawesome/free-solid-svg-icons';

	export let username: string | null;
	$: headerLinks = getHeaderLinks(username == null ? false : true);
</script>

<AppBar
	background="bg-surface-100 dark:bg-surface-800"
	gridColumns="grid-cols-3"
	slotDefault="place-self-center"
	slotTrail="place-content-end"
	shadow="shadow-xl"
>
	<svelte:fragment slot="lead">
		<div class="flex">
			<button
				class="btn outline-none"
				on:click={() => {
					drawerStore.open();
				}}
			>
				<Fa icon={faBars} size="24" />
			</button>
			<a href="/"><Logo color="black" /></a>
		</div>
	</svelte:fragment>
	<div class="items-center hidden grid-flow-col lg:grid">
		{#each headerLinks as link}
			{#if $page.url.pathname == link.href}
				<a class="btn font-semibold" href={link.href}>{link.name}</a>
			{:else}
				<a class="btn" href={link.href}>{link.name}</a>
			{/if}
		{/each}
	</div>
	<svelte:fragment slot="trail">
		{#if username}
			<p>{username.replaceAll('"', '')}!</p>
		{:else}
			<div class="hidden sm:grid items-center grid-flow-col px-2 justify-self-end gap-x-4">
				<a class="btn variant-soft" href="/auth/login">Sign In</a>
				<a class="btn variant-filled" href="/auth/register"> Get Started </a>
			</div>
		{/if}
	</svelte:fragment>
</AppBar>
