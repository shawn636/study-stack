<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte';
	import Header from '$lib/sections/header.svelte';
	import Footer from '$lib/sections/footer.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<Sidebar />
<AppShell slotPageFooter="bg-surface-100 dark:bg-surface-700">
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>

	<slot />

	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>
