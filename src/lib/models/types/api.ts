/* This file contains type definitions for the json response of various endpoints.
 * It is meant to be imported by both the server and the client.
 */

import type { Course, User } from '$lib/models/types/database.types';

/* ENDPOINT: /api/search/courses */
// type Instructor = { instructorId: string } & Omit<User, 'userId'>;
export type CourseWithInstructor = Course & User;

export type CourseSearchResult = {
    courseCount: number;
    courses: CourseWithInstructor[];
};
