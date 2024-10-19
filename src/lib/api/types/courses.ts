/**
 * GET /courses
 * Search for courses with a specific course by search ID
 *
 * GET /courses/:courseId
 * Retrieve a specific course by ID.
 *
 * GET /courses/:courseId/instructor
 * Retrieve the instructor of a specific course by ID.
 */

import type { Course, User } from '$lib/models/types/database.types';
import type { Selectable } from 'kysely';

import type { ApiResponse } from './common';

export type CourseResult = {
    course: Selectable<Course> & { isFavorite?: boolean };
    instructor: Selectable<User>;
};

export type CourseSearchResult = {
    courses: CourseResult[];
    totalCourses: number;
};

export type CourseSearchGetResponse = ApiResponse<CourseSearchResult>;
export type CourseGetResponse = ApiResponse<CourseResult>;
export type CourseInstructorGetResponse = ApiResponse<User>;
