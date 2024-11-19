/**
 * PUT /users/:userId
 * Update the details of a specific user.
 *
 * POST /users/:userId/photo
 * Upload a photo for a specific user.
 *
 * GET /users/:userId/course-favorites
 * Retrieve the list of course ID's favorited by a specific user.
 *
 * POST /users/:userId/course-favorites
 * Add a course to the list of favorites for a specific user.
 *
 * DELETE /users/:userId/course-favorites
 * Remove a course from the list of favorites for a specific user.
 */

import type { ApiResponse } from './common';
import type { Updateable } from 'kysely';
import type { User } from '$lib/models/types/database.types';

type ImageUploadResult = {
    imageId: string;
    imageUrl: string;
};

type DeleteFavoriteResult = {
    deleted: boolean;
    message: string;
};

type CreateFavoriteResult = {
    created: boolean;
    message: string;
};

export type UserUpdateResponse = ApiResponse<Updateable<User>>;
export type UserPhotoCreateResponse = ApiResponse<ImageUploadResult>;
export type CourseFavoritesCreateResponse = ApiResponse<CreateFavoriteResult>;
export type CourseFavoritesDeleteResponse = ApiResponse<DeleteFavoriteResult>;
