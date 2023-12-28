<script lang="ts">
    // Most of your app wide CSS should be put in this file
    import '../app.postcss';
    import * as amplitude from '@amplitude/analytics-browser';
    import { onMount } from 'svelte';
    import { PUBLIC_AMPLITUDE_API_KEY } from '$env/static/public';
    import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
    import { storePopup } from '@skeletonlabs/skeleton';
    import { setModeCurrent, initializeStores } from '@skeletonlabs/skeleton';

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
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', updateTheme);
        updateTheme();

        return () => {
            mediaQuery.removeEventListener('change', updateTheme);
        };
    });

    const updateTheme = () => {
        const color_pref = localStorage.getItem('color-theme');
        const prefers_dark =
            !('color-theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (color_pref === 'dark' || prefers_dark) {
            setModeCurrent(false);
        } else {
            setModeCurrent(true);
        }
    };
</script>

<slot />
