<script lang="ts">
	import Logo from '$lib/components/logo.svelte';
	import { AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
</script>

<AppShell
	slotSidebarRight="bg-gradient-to-tr from-primary-700 to-primary-500 w-64 hidden md:block rounded-l-3xl shadow-xl"
>
	<div class="container grid grid-flow-row justify-items-center items-center h-full">
		<div class="grid grid-items-center">
			<a
				href="/"
				class="btn btn-iconn text-surface-700 dark:text-surface-300 justify-start flex items-center text-center gap-1 p-1"
			>
				<Fa icon={faChevronLeft} />
				Home
			</a>
			<div class="card shadow-lg p-10">
				<slot />
			</div>
		</div>
	</div>

	<svelte:fragment slot="sidebarRight">
		<div class="grid justify-items-center items-center h-full">
			<Logo layout="vertical" />
		</div>
	</svelte:fragment>
</AppShell>
