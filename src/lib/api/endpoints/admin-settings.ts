import type { SiteSetting } from '$lib/models/types/database.types';

import type { ApiClient } from '../api-client';
import type {
    AdminSettingsGetResponse,
    AdminSettingsUpdateResponse
} from '../types/admin-settings';

import { fetchWithTimeout, handleApiResponse } from '../utils';

/**
 * Class representing the administration settings module.
 * Handles the API interactions related to administrative settings.
 */
class AdminSettingsModule {
    private client: ApiClient;

    /**
     * Create an AdminSettingsModule.
     * @param {ApiClient} client - The API client for making network requests.
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * GET /api/admin-settings
     * Fetches the admin settings for the provided keys.
     *
     * @param {Array<string>} settings - The keys of the settings to retrieve.
     * @returns {Promise<AdminSettingsGetResponse>} A promise that resolves to the fetched admin settings.
     * @throws {Error} Throws an error if no settings are provided.
     */
    async get(
        settings: Array<string>,
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<AdminSettingsGetResponse> {
        if (!settings || settings.length === 0) {
            throw new Error('Invalid request. Please provide settings to retrieve.');
        }
        const params = new URLSearchParams();
        settings.forEach((setting) => params.append('settings', setting));

        const url = this.client.getFullUrl(`/api/admin-settings/?${params.toString()}`);

        const response = await fetchWithTimeout(
            url,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            },
            timeout,
            fetchFn
        );
        return handleApiResponse<AdminSettingsGetResponse>(response);
    }

    /**
     * PATCH /api/admin-settings
     * Updates the admin settings.
     *
     * @returns {Promise<AdminSettingsUpdateResponse>} A promise that resolves to the response of the update operation.
     */
    async update(
        siteSettings: SiteSetting[],
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<AdminSettingsUpdateResponse> {
        const url = this.client.getFullUrl('/api/admin-settings');
        const response = await fetchWithTimeout(
            url,
            {
                body: JSON.stringify({ settings: siteSettings }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PATCH'
            },
            timeout,
            fetchFn
        );
        return handleApiResponse<AdminSettingsUpdateResponse>(response);
    }
}

export default AdminSettingsModule;
