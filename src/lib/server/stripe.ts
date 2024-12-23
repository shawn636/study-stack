import {
    STRIPE_SANDBOX_SECRET_KEY,
    STRIPE_SANDBOX_WEBHOOK_SECRET,
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET
} from '$env/static/private';

import crypto from 'crypto';
import { dev } from '$app/environment';
import { memoizeFunction } from './util';
import Stripe from 'stripe';

const devEnv = dev || import.meta.env.MODE === 'test' || import.meta.env.MODE === 'development';
export const SECRET_KEY = devEnv ? STRIPE_SANDBOX_SECRET_KEY : STRIPE_SECRET_KEY;
export const WEBHOOK_SECRET = devEnv ? STRIPE_SANDBOX_WEBHOOK_SECRET : STRIPE_WEBHOOK_SECRET;

const getStripe = memoizeFunction(() => new Stripe(SECRET_KEY));
export const stripe = getStripe();

/**
 * Generates a Stripe-compatible signature for webhook testing.
 * @param payload - The raw stringified body of the event.
 * @returns A string that mimics Stripe's signature header format.
 */
export function generateStripeSignature(payload: string): string {
    const timestamp = Math.floor(Date.now() / 1000); // Current timestamp
    const signedPayload = `${timestamp}.${payload}`; // Match Stripe's signature format
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    hmac.update(signedPayload);
    const signature = hmac.digest('hex');
    return `t=${timestamp},v1=${signature}`;
}
