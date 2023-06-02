<script lang="ts">
	import Logo from '$lib/components/logo.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell
	slotSidebarRight="bg-gradient-to-tr from-primary-700 to-primary-500 w-64 hidden md:block rounded-l-3xl shadow-xl"
>
	<div class="container grid grid-flow-row justify-items-center items-center h-full">
		<slot />
	</div>

	<svelte:fragment slot="sidebarRight">
		<div class="grid justify-items-center items-center h-full">
			<Logo layout="vertical" />
		</div>
	</svelte:fragment>
</AppShell>
