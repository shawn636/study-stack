<script lang="ts">
	import * as amplitude from '@amplitude/analytics-browser';
	import '../app.css';
	import { onMount } from 'svelte';
	import { PUBLIC_AMPLITUDE_API_KEY } from '$env/static/public';

	onMount(() => {
		amplitude.init(PUBLIC_AMPLITUDE_API_KEY, undefined, {
			defaultTracking: {
				sessions: true,
				pageViews: true,
				formInteractions: true,
				fileDownloads: true
			}
		});
	});
</script>

<slot />
