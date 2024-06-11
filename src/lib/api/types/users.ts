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

export type UserUpdateResponse = ApiResponse<null>;
export type UserPhotoCreateResponse = ApiResponse<null>;
export type UserCourseFavoritesGetResponse = ApiResponse<string[]>;
export type UserCourseFavoritesCreateResponse = ApiResponse<null>;
export type UserCourseFavoritesDeleteResponse = ApiResponse<null>;
