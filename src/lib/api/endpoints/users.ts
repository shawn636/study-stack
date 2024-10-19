import type {
    CourseFavoritesCreateResponse,
    UserPhotoCreateResponse,
    UserUpdateResponse
} from '../types/users';
import { fetchWithTimeout, handleApiResponse } from '../utils';

import type { ApiClient } from '../api-client';
import type { User } from '$lib/models/types/database.types';

class UsersModule {
    private client: ApiClient;

    constructor(client: ApiClient) {
        this.client = client;
    }

    async favoriteCourse(userId: string, courseId: string): Promise<CourseFavoritesCreateResponse> {
        const url = this.client.getFullUrl(`/api/users/${userId}/course-favorites/${courseId}`);

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });

        return handleApiResponse<CourseFavoritesCreateResponse>(response);
    }

    async unfavoriteCourse(
        userId: string,
        courseId: string
    ): Promise<CourseFavoritesCreateResponse> {
        const url = this.client.getFullUrl(`/api/users/${userId}/course-favorites/${courseId}`);

        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        });

        return handleApiResponse<CourseFavoritesCreateResponse>(response);
    }

    async update(
        userId: string,
        user: User,
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<UserUpdateResponse> {
        const url = this.client.getFullUrl(`/api/users/${userId}`);
        const response = await fetchWithTimeout(
            url,
            {
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PUT'
            },
            timeout,
            fetchFn
        );

        return handleApiResponse<UserUpdateResponse>(response);
    }

    async uploadPhoto(
        userId: string,
        file: File,
        fetchFn: typeof fetch = fetch,
        timeout: number = 5000
    ): Promise<UserPhotoCreateResponse> {
        const url = this.client.getFullUrl(`/api/users/${userId}/photo`);

        const formData = new FormData();
        formData.append('profilePhoto', file);
        formData.append('userId', userId);

        const response = await fetchWithTimeout(
            url,
            {
                body: formData,
                method: 'POST'
            },
            timeout,
            fetchFn
        );

        return handleApiResponse<UserPhotoCreateResponse>(response);
    }
}

export default UsersModule;
