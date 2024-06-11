/**
 * This module handles interactions with the categories API.
 */

import { type ContactForm } from '$lib/models/forms/contact';

import type { ApiClient } from '../api-client';
import type { ContactMessageCreateResponse } from '../types/contact-messages';

import { fetchWithTimeout, handleApiResponse } from '../utils';

class ContactMessagesModule {
    private client: ApiClient;

    /**
     * Creates an instance of ContactMessagesModule.
     * @param client {ApiClient} - The API client instance to be used for making requests.
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    /**
     * GET /api/contact-messages
     * Fetches the top categories from the server.
     *
     * @param fetchFn {typeof fetch} - The fetch function to use for making the API call, defaults to the global fetch API.
     * @returns {Promise<ContactMessageCreateResponse>} - A promise that resolves to the response of the top categories API call.
     */
    async create(
        form: ContactForm,
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<ContactMessageCreateResponse> {
        const url = this.client.getFullUrl('/api/contact-messages');

        const formData = new FormData();

        formData.append('email', form.email);
        formData.append('message', form.message);
        if (form.name) {
            formData.append('name', form.name);
        }

        const response = await fetchWithTimeout(
            url,
            { body: formData, method: 'POST' },
            timeout,
            fetchFn
        );

        return handleApiResponse<ContactMessageCreateResponse>(response);
    }
}

export default ContactMessagesModule;
