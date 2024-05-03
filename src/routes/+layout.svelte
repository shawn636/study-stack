<script lang="ts">
    // Most of your app wide CSS should be put in this file
    import '../app.postcss';

    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
    import * as amplitude from '@amplitude/analytics-browser';
    import { onMount } from 'svelte';
    import { PUBLIC_AMPLITUDE_API_KEY } from '$env/static/public';
    import { ModeWatcher } from 'mode-watcher';
    import { Toaster } from '$lib/components/ui/sonner';

    onMount(() => {
        if (!dev) {
            amplitude.init(PUBLIC_AMPLITUDE_API_KEY, undefined, {
                defaultTracking: {
                    sessions: true,
                    pageViews: true,
                    formInteractions: true,
                    fileDownloads: true
                }
            });
        }
    });

    // Inject Vercel analytics, based on Dev Environment
    inject({ mode: dev ? 'development' : 'production' });

    injectSpeedInsights();
</script>

<ModeWatcher />
<Toaster />
<slot />
