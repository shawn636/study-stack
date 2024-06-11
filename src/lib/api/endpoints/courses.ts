import type { ApiClient } from '../api-client';

// import { fetchWithTimeout } from '../utils';

// import { defaultHeaders, fetchWithTimeout, handleApiResponse } from '../utils';

/**
 * Class representing the administration settings module.
 * Handles the API interactions related to administrative settings.
 */
class CoursesModule {
    private client: ApiClient;

    /**
     * Create an AdminSettingsModule.
     * @param {ApiClient} client - The API client for making network requests.
     */
    constructor(client: ApiClient) {
        this.client = client;
    }

    // GET /api/courses

    // GET /api/courses/:course_id

    // GET /api/courses/:course_id/instructor
}

export default CoursesModule;
