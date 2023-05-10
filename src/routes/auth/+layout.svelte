<script lang="ts">
	import Logo from '$lib/components/logo.svelte';
</script>

<div class="grid grid-cols-1 md:grid-cols-2 h-screen">
	<div
		data-testid="login-form"
		class="grid grid-rows-[auto_auto] justify-items-center items-center"
	>
		<slot />
	</div>
	<div
		data-testid="login-sidepanel"
		class="hidden md:grid bg-gradient-to-tr from-sky-400 to-light-blue-900 rounded-l-3xl md:justify-items-center items-center"
	>
		<Logo layout="vertical" />
	</div>
</div>
