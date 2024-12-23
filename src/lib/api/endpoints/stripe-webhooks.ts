/**
 * This module handles interactions with the Stripe Webhook API.
 */

import type { ApiClient } from '../api-client';
import type { StripeWebhooksPostResponse } from '../types/stripe-webhooks';

import { fetchWithTimeout, handleApiResponse } from '../utils';

class StripeWebhooksModule {
    private client: ApiClient;

    constructor(client: ApiClient) {
        this.client = client;
    }

    async pushEvent(
        eventPayload: string,
        signature: string,
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<StripeWebhooksPostResponse> {
        const url = this.client.getFullUrl('/api/stripe-webhooks');

        const response = await fetchWithTimeout(
            url,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'stripe-signature': signature
                },
                body: eventPayload
            },
            timeout,
            fetchFn
        );

        return handleApiResponse<StripeWebhooksPostResponse>(response);
    }
}

export default StripeWebhooksModule;
