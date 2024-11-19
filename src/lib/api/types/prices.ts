/**
 * GET /prices
 * Retrieve the corresponding Stripe prices for a list of lookup keys.
 */

import type { ApiResponse } from './common';
import type { Stripe } from 'stripe';

export type PriceData = Record<string, Stripe.Price | null>;
export type PricesGetResponse = ApiResponse<PriceData>;
