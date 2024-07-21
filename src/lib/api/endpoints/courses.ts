import type { CourseSortByOption } from '$lib/models/types/course-sort-by-options';

import type { ApiClient } from '../api-client';
import type {
    CourseGetResponse,
    CourseInstructorGetResponse,
    CourseSearchGetResponse
} from '../types/courses';

import { fetchWithTimeout, handleApiResponse } from '../utils';

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

    // GET /api/courses/:course_id
    async getCourse(
        courseId: string,
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<CourseGetResponse> {
        const url = this.client.getFullUrl(`/api/courses/${courseId}`);

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

        return handleApiResponse<CourseGetResponse>(response);
    }

    // GET /api/courses/:course_id/instructor
    async getCourseInstructor(
        courseId: string,
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<CourseInstructorGetResponse> {
        const url = this.client.getFullUrl(`/api/courses/${courseId}/instructor`);

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

        return handleApiResponse<CourseInstructorGetResponse>(response);
    }

    // GET /api/courses
    async getCourses(
        query: null | string,
        sortByOption: CourseSortByOption,
        page: number,
        pageSize: number,
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<CourseSearchGetResponse> {
        const params = new URLSearchParams();
        if (query) {
            params.append('query', query);
        }
        params.append('sort_by', sortByOption.param);
        params.append('page', page.toString());
        params.append('page_size', pageSize.toString());

        const url = this.client.getFullUrl(`/api/courses?${params.toString()}`);

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

        return handleApiResponse<CourseSearchGetResponse>(response);
    }

    async getCoursesWithFavorites(
        query: null | string,
        sortByOption: CourseSortByOption,
        page: number,
        pageSize: number,
        userId: string,
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<CourseSearchGetResponse> {
        const params = new URLSearchParams();
        if (query) {
            params.append('query', query);
        }
        params.append('sort_by', sortByOption.param);
        params.append('page', page.toString());
        params.append('page_size', pageSize.toString());
        params.append('user_id', userId);

        const url = this.client.getFullUrl(`/api/courses?${params.toString()}`);

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

        return handleApiResponse<CourseSearchGetResponse>(response);
    }
}

export default CoursesModule;
