<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte';
	import Header from '$lib/sections/header.svelte';
	import Footer from '$lib/sections/footer.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
	$: email = JSON.stringify(data.user?.email, null);
</script>

<Sidebar username={email} />
<AppShell slotPageFooter="bg-surface-100 dark:bg-surface-700">
	<svelte:fragment slot="header">
		<Header username={email} />
	</svelte:fragment>

	<slot />

	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>
