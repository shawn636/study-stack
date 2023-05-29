<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte';
	import Header from '$lib/sections/header.svelte';
	import Footer from '$lib/sections/footer.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
	$: username = JSON.stringify(data.user?.username, null);
</script>

<Sidebar {username} />
<AppShell slotPageFooter="bg-surface-100 dark:bg-surface-700">
	<svelte:fragment slot="header">
		<Header {username} />
	</svelte:fragment>

	<slot />

	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>
