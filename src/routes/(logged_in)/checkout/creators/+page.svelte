<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import { loadStripe, type StripeEmbeddedCheckout } from '@stripe/stripe-js';
    import {
        PUBLIC_STRIPE_PUBLISHABLE_KEY,
        PUBLIC_STRIPE_SANDBOX_PUBLISHABLE_KEY
    } from '$env/static/public';
    import { dev } from '$app/environment';
    import FallbackForm from './(components)/fallback-form.svelte';
    import FreeSignupForm from './(components)/free-signup-form.svelte';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    let showErrorFallback = $state(false);
    let checkoutInstance = $state<StripeEmbeddedCheckout | null>(null);
    let isInitialized = $state(false);

    const key = $page.url.pathname;
    const lookupKey = $page.url.searchParams.get('lookup_key');
    const showFreePlanFallback = lookupKey?.startsWith('creators-free-');

    const devEnv = dev || import.meta.env.MODE === 'test' || import.meta.env.MODE === 'development';
    const stripePublishableKey = devEnv
        ? PUBLIC_STRIPE_SANDBOX_PUBLISHABLE_KEY
        : PUBLIC_STRIPE_PUBLISHABLE_KEY;

    const initializeCheckout = async () => {
        const stripe = await loadStripe(stripePublishableKey);

        const lookupKey = $page.url.searchParams.get('lookup_key');
        if (!lookupKey) {
            showErrorFallback = true;
            return;
        }
        if (stripe) {
            isInitialized = true;
            checkoutInstance = await stripe.initEmbeddedCheckout({
                fetchClientSecret: async () => {
                    const response = await fetch(
                        '/api/checkout-sessions/?checkoutTarget=creator-subscription',
                        {
                            method: 'POST',
                            body: JSON.stringify({ lookup_key: lookupKey })
                        }
                    );
                    const { clientSecret } = await response.json();
                    return clientSecret;
                }
            });
            checkoutInstance.mount('#checkout');
        } else {
            showErrorFallback = true;
        }
    };

    onMount(() => {
        if (!showFreePlanFallback) {
            initializeCheckout();
        }

        return () => {
            if (checkoutInstance) {
                checkoutInstance.destroy();
            }
        };
    });
</script>

<section>
    {#key key}
        {#if showFreePlanFallback}
            <FreeSignupForm />
        {:else if showErrorFallback}
            <FallbackForm />
        {:else if isInitialized}
            <Card.Root class="mx-auto min-h-64 max-w-7xl bg-white">
                <Card.Content>
                    {#if showErrorFallback}{:else if showFreePlanFallback}{:else}
                        <!-- Stripe Checkout Form (via script) -->
                        <div id="checkout"></div>
                    {/if}
                </Card.Content>
            </Card.Root>
        {/if}
    {/key}
</section>
