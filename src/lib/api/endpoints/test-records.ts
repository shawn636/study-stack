import type { ApiClient } from '../api-client';
import type { TestRecordsDeleteResponse } from '../types/test-records';

import { fetchWithTimeout, handleApiResponse } from '../utils';

class TestRecordsModule {
    private client: ApiClient;

    /**
     * Creates an instance of ContactMessagesModule.
     * @param client {ApiClient} - The API client instance to be used for making requests.
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * DELETE /test-records
     * Delete all test records from the database.
     *
     * @param fetchFn {typeof fetch} - The fetch function to use for making the API call, defaults to the global fetch API.
     * @returns {Promise<TestRecordsDeleteResponse>} - A promise that resolves to the response of the top categories API call.
     */
    async delete(
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<TestRecordsDeleteResponse> {
        const url = this.client.getFullUrl('/api/test-records');

        const response = await fetchWithTimeout(url, { method: 'DELETE' }, timeout, fetchFn);

        return handleApiResponse<TestRecordsDeleteResponse>(response);
    }
}

export default TestRecordsModule;
