// This file contains type definitions for the response of the search courses endpoint.
// It is meant to be imported by both the server and the client.

import type { Course, User } from '$lib/models/types/database.types';

type Instructor = Omit<User, 'id'> & { instructorId: string };
export type CourseWithInstructor = Course & Instructor;

export type Result = {
    courseCount: number;
    courses: CourseWithInstructor[];
};
