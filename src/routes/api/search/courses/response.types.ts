// This file contains type definitions for the response of the search courses endpoint.
// It is meant to be imported by both the server and the client.

import type { Course, User } from '$lib/models/types/database.types';

// type Instructor = { instructorId: string } & Omit<User, 'userId'>;
export type CourseWithInstructor = Course & User;

export type Result = {
    courseCount: number;
    courses: CourseWithInstructor[];
};
