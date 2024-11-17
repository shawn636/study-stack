<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import { fetchClientSecret } from './util';
    import { loadStripe } from '@stripe/stripe-js';
    import { onMount } from 'svelte';
    import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

    let showErrorFallback = $state(false);

    onMount(async () => {
        const stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);

        if (stripe) {
            const checkout = await stripe.initEmbeddedCheckout({
                fetchClientSecret
            });
            checkout.mount('#checkout');
        } else {
            showErrorFallback = true;
        }
    });
</script>

<section>
    <!-- Display a payment form -->

    {#if showErrorFallback}
        <p>Sorry, we couldn't load the payment form. Please try again later.</p>
    {/if}

    <div class="mx-auto max-w-7xl">
        <Card.Root class="mx-auto max-w-7xl bg-white">
            <Card.Content>
                <div id="checkout">
                    <!-- Checkout will insert the payment form here -->
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</section>
