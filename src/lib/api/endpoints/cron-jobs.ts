import type { ApiClient } from '../api-client';
import type { SessionCleanupGetResponse } from '../types/cron-jobs';

import { fetchWithTimeout, handleApiResponse } from '../utils';

class CronJobsModule {
    private client: ApiClient;

    constructor(client: ApiClient) {
        this.client = client;
    }

    async sessionCleanup(
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<SessionCleanupGetResponse> {
        const url = this.client.getFullUrl('/api/cron/session-cleanup');

        const response = await fetchWithTimeout(url, { method: 'GET' }, timeout, fetchFn);

        return handleApiResponse<SessionCleanupGetResponse>(response);
    }
}

export default CronJobsModule;
