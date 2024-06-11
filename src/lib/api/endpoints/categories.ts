/**
 * This module handles interactions with the categories API.
 */

import type { ApiClient } from '../api-client';
import type { TopCategoriesGetResponse } from '../types/categories';

import { fetchWithTimeout, handleApiResponse } from '../utils';

/**
 * The CategoriesModule class provides methods to interact with the categories API endpoints.
 */
class CategoriesModule {
    private client: ApiClient;

    /**
     * Creates an instance of CategoriesModule.
     * @param client {ApiClient} - The API client instance to be used for making requests.
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * GET /api/categories/top
     * Fetches the top categories from the server.
     *
     * @param fetchFn {typeof fetch} - The fetch function to use for making the API call, defaults to the global fetch API.
     * @returns {Promise<TopCategoriesGetResponse>} - A promise that resolves to the response of the top categories API call.
     */
    async getTopCategories(
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<TopCategoriesGetResponse> {
        const url = this.client.getFullUrl('/api/categories/top');

        const response = await fetchWithTimeout(url, { method: 'GET' }, timeout, fetchFn);

        return handleApiResponse<TopCategoriesGetResponse>(response);
    }
}

export default CategoriesModule;
