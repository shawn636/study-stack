<script lang="ts">
    // Most of your app wide CSS should be put in this file
    import '../app.postcss';

    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
    import * as amplitude from '@amplitude/analytics-browser';
    import { onMount } from 'svelte';
    import { PUBLIC_AMPLITUDE_API_KEY } from '$env/static/public';
    import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
    import { storePopup } from '@skeletonlabs/skeleton';
    import { setModeCurrent, initializeStores } from '@skeletonlabs/skeleton';

    // Required for Skeleton-UI Popups and Modals
    initializeStores();
    storePopup.set({
        computePosition,
        autoUpdate,
        offset,
        shift,
        flip,
        arrow
    });

    onMount(() => {
        amplitude.init(PUBLIC_AMPLITUDE_API_KEY, undefined, {
            defaultTracking: {
                sessions: true,
                pageViews: true,
                formInteractions: true,
                fileDownloads: true
            }
        });

        // Set the theme based on the user's preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', updateTheme);
        updateTheme();

        return () => {
            mediaQuery.removeEventListener('change', updateTheme);
        };
    });

    // Update the theme based on the user's preference
    const updateTheme = () => {
        const colorPref = localStorage.getItem('color-theme');
        const prefersDark =
            !('color-theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (colorPref === 'dark' || prefersDark) {
            setModeCurrent(false);
        } else {
            setModeCurrent(true);
        }
    };

    // Inject Vercel analytics, based on Dev Environment
    inject({ mode: dev ? 'development' : 'production' });

    injectSpeedInsights();
</script>

<slot />
