import type { Stripe } from 'stripe';

export async function processEvent(event: Stripe.Event) {
    console.log(`Received webhook event of type: ${event.type} with ID: ${event.id}`);
}
