/**
 * This module handles interactions with the categories API.
 */

import type { ApiClient } from '../api-client';
import type { PricesGetResponse } from '../types/prices';

import { fetchWithTimeout, handleApiResponse } from '../utils';

class PricesModule {
    private client: ApiClient;

    constructor(client: ApiClient) {
        this.client = client;
    }

    async getPrices(
        lookupKeys: string[],
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<PricesGetResponse> {
        const url = this.client.getFullUrl('/api/prices?lookup_keys=' + lookupKeys.join(','));

        const response = await fetchWithTimeout(
            url,
            {
                method: 'GET',
                headers: {
                    'content-type': 'application/json;charset=UTF-8'
                }
            },
            timeout,
            fetchFn
        );

        return handleApiResponse<PricesGetResponse>(response);
    }
}

export default PricesModule;
