import type {
    AdminSettingsGetMultipleResponse,
    AdminSettingsGetResponse,
    AdminSettingsUpdateResponse
    // AdminSettingsUpdateResponse
} from '../types/admin-settings';
import { fetchWithTimeout, handleApiResponse } from '../utils';

import type { ApiClient } from '../api-client';
import type { SiteSetting } from '$lib/models/types/database.types';

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

    async get(
        setting: string,
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<AdminSettingsGetResponse> {
        if (!setting) {
            throw new Error('Invalid request. Please provide settings to retrieve.');
        }
        // Convert setting to url-safe string
        setting = encodeURIComponent(setting);

        const url = this.client.getFullUrl(`/api/admin-settings/${setting}`);

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
     * GET /api/admin-settings
     * Fetches the admin settings for the provided keys.
     *
     * @param {Array<string>} settings - The keys of the settings to retrieve.
     * @returns {Promise<AdminSettingsGetMultipleResponse>} A promise that resolves to the fetched admin settings.
     * @throws {Error} Throws an error if no settings are provided.
     */
    async getMultiple(
        settings: Array<string>,
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<AdminSettingsGetMultipleResponse> {
        if (!settings || settings.length === 0) {
            throw new Error('Invalid request. Please provide settings to retrieve.');
        }
        const params = new URLSearchParams();
        settings.forEach((setting) => params.append('settings', setting));

        const url = this.client.getFullUrl(`/api/admin-settings?${params.toString()}`);

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

        return handleApiResponse<AdminSettingsGetMultipleResponse>(response);
    }

    /**
     * PATCH /api/admin-settings
     * Updates the admin settings.
     *
     * @returns {Promise<AdminSettingsUpdateResponse>} A promise that resolves to the response of the update operation.
     */
    async update(
        siteSetting: SiteSetting,
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<AdminSettingsUpdateResponse> {
        const encodedKey = encodeURIComponent(siteSetting.siteSettingKey);

        const url = this.client.getFullUrl(`/api/admin-settings/${encodedKey}`);
        const response = await fetchWithTimeout(
            url,
            {
                body: JSON.stringify({ setting: siteSetting }),
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
