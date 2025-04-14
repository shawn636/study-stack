<script lang="ts">
    // Most of your app wide CSS should be put in this file
    import '../app.postcss';

    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
    import { ModeWatcher } from 'mode-watcher';
    import { Toaster } from '$lib/components/ui/sonner';
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    // Inject Vercel analytics, based on Dev Environment
    inject({ mode: dev ? 'development' : 'production' });

    injectSpeedInsights();
</script>

<ModeWatcher />
<Toaster />
{@render children?.()}
