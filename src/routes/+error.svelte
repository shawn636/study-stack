<script lang="ts">
    import Header from '$lib/components/header.svelte';
    import { mode } from 'mode-watcher';
    import { page } from '$app/stores';

    type Illustration = {
        light: string;
        dark: string;
    };

    type ErrorMessage = {
        illustration: Illustration;
        title: string;
        tagline: string;
    };

    type ErrorMessages = {
        [key: string]: ErrorMessage;
    };

    // Define illustrations and messages based on error codes and ranges
    const errorMessages: ErrorMessages = {
        '401': {
            illustration: { light: '/images/secure-light.svg', dark: '/images/secure-dark.svg' },
            title: '401',
            tagline: 'Oops! You need to log in to access this page.'
        },
        '403': {
            illustration: { light: '/images/secure-light.svg', dark: '/images/secure-dark.svg' },
            title: '403',
            tagline: "Oops! It looks like you don't have permission for that."
        },
        '404': {
            illustration: { light: '/images/lost-light.svg', dark: '/images/lost-dark.svg' },
            title: '404',
            tagline: 'Oops, the page you requested could not be found.'
        },
        '4XX': {
            illustration: { light: '/images/warning-light.svg', dark: '/images/warning-dark.svg' },
            title: '4XX Error',
            tagline: "We can't find the page you're looking for."
        },
        '5XX': {
            illustration: { light: '/images/warning-light.svg', dark: '/images/warning-dark.svg' },
            title: '5XX Error',
            tagline: 'Our team is on it! Please try again later.'
        },
        default: {
            illustration: { light: '/images/error-light.svg', dark: '/images/error-dark.svg' },
            title: 'Error',
            tagline: 'Something went wrong. Please try again later.'
        }
    };

    // Use the new $derived.by() syntax in Svelte 5
    const errorDetails = $derived.by(() => {
        const status = $page.status;

        if (status === 401 || status === 403 || status === 404) {
            return errorMessages[status];
        } else if (status >= 400 && status < 500) {
            return errorMessages['4XX'];
        } else if (status >= 500 && status < 600) {
            return errorMessages['5XX'];
        } else {
            return errorMessages.default;
        }
    });

    const getVariant = (illustration: Illustration) => {
        const isDarkMode = $mode === 'dark';
        return isDarkMode ? illustration.dark : illustration.light;
    };
</script>

<div data-testid="app-shell">
    <Header user={undefined} />
    <div
        class="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-8 px-4 py-8 text-center sm:flex-row sm:px-8 sm:text-left"
    >
        <img
            class="w-full max-w-xs sm:w-auto sm:max-w-sm"
            src={getVariant(errorDetails.illustration)}
            alt="Error illustration"
        />
        <div class="flex flex-col items-center sm:items-start">
            <p class="text-9xl font-bold text-red-500">{$page.status}</p>
            <p class="mt-4 text-xl">{errorDetails.tagline}</p>
            <a href="/" class="mt-6 text-blue-500 hover:underline">Return to Homepage</a>
        </div>
    </div>
</div>
