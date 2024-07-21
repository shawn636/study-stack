/* This file contains type definitions for the json response of various endpoints.
 * It is meant to be imported by both the server and the client.
 */

import type { Course, User } from '$lib/models/types/database.types';

/* ENDPOINT: /api/search/courses */
export type CourseWithInstructor = Course & User;

export type CourseSearchResult = {
    courseCount: number;
    courses: CourseWithInstructor[];
};

/* ENDPOINT: DELETE /api/user/course-favorites */
export type DeleteFavoriteResponse = {
    deleted: boolean;
    message: string;
};

/* ENDPOINT: DELETE /api/user/course-favorites */
export type CreateFavoriteResponse = {
    created: boolean;
    message: string;
};
