<script lang="ts">
	import * as amplitude from '@amplitude/analytics-browser';
	import '../app.css';

	amplitude.init('739ec8caebbccf02c3c6f26e0657cd24', undefined, {
		defaultTracking: {
			sessions: true,
			pageViews: true,
			formInteractions: true,
			fileDownloads: true
		}
	});
</script>

<slot />
