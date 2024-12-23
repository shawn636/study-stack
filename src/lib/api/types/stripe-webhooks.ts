/**
 * POST /stripe-webhooks
 * Pushes a Stripe webhook event to the API.
 */

import type { ApiResponse } from './common';

export type StripeWebhooksPostResponse = ApiResponse<null>;
