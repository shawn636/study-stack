/**
 * This module handles interactions with the NewsletterSubscriptions API.
 */

import type { ApiClient } from '../api-client';
import type { NewsletterSubscriptionCreateResponse } from '../types/newsletter-subscriptions';

import { fetchWithTimeout, handleApiResponse } from '../utils';

class NewsletterSubscriptionModule {
    private client: ApiClient;

    /**
     * Creates an instance of ContactMessagesModule.
     * @param client {ApiClient} - The API client instance to be used for making requests.
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * POST /api/newsletter-subscriptions
     * Submits a newsletter subscription request to the server and returns the response.
     *
     * @param fetchFn {typeof fetch} - The fetch function to use for making the API call, defaults to the global fetch API.
     * @returns {Promise<NewsletterSubscriptionCreateResponse>} - A promise that resolves to the response of the top categories API call.
     */
    async subscribe(
        email: string,
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<NewsletterSubscriptionCreateResponse> {
        const url = this.client.getFullUrl('/api/newsletter-subscriptions');

        const formData = new FormData();
        formData.append('email', email);

        const response = await fetchWithTimeout(
            url,
            { body: formData, method: 'POST' },
            timeout,
            fetchFn
        );

        return handleApiResponse<NewsletterSubscriptionCreateResponse>(response);
    }
}

export default NewsletterSubscriptionModule;
