<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import { loadStripe, type StripeEmbeddedCheckout } from '@stripe/stripe-js';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

    let showErrorFallback = $state(false);
    let checkoutInstance = $state<StripeEmbeddedCheckout | null>(null);
    const key = $page.url.pathname;

    const initializeCheckout = async () => {
        const stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);

        const lookupKey = $page.url.searchParams.get('lookup_key');
        if (!lookupKey) {
            showErrorFallback = true;
            return;
        }
        if (stripe) {
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
        initializeCheckout();

        return () => {
            if (checkoutInstance) {
                checkoutInstance.destroy();
            }
        };
    });
</script>

<section>
    {#key key}
        <Card.Root class="mx-auto min-h-64 max-w-7xl bg-white">
            <Card.Content>
                {#if showErrorFallback}
                    <div
                        class="flex flex-col items-center justify-center gap-8 px-4 py-8 text-center sm:flex-row sm:px-8 sm:text-left"
                    >
                        <img
                            class="w-full max-w-xs sm:w-auto sm:max-w-sm"
                            src="/images/warning-light.svg"
                            alt="Error illustration"
                        />
                        <div class="flex flex-col items-center sm:items-start">
                            <p class="text-7xl font-bold text-gray-700">Uh-oh!</p>
                            <p class="mt-4 text-lg text-gray-800">
                                We're not quite sure what happened there, but we couldn't load the
                                payment form. Please try again and if the problem persists, feel
                                free to <a href="/contact" class="text-blue-500 hover:underline"
                                    >contact us</a
                                > to let us know.
                            </p>
                        </div>
                    </div>

                    <!-- <p class="text-black">
                        Sorry, we couldn't load the payment form. Please try again later.
                    </p> -->
                {:else}
                    <div id="checkout">
                        <!-- Checkout will insert the payment form here -->
                    </div>
                {/if}
            </Card.Content>
        </Card.Root>
    {/key}
</section>
