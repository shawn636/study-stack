<script lang="ts">
	import * as amplitude from '@amplitude/analytics-browser';
	import '../app.css';
	import { onMount } from 'svelte';

	onMount(() => {
		amplitude.init(process.env['AMPLITUDE_API_KEY'] ?? '', undefined, {
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
