import type { Course, User } from '$lib/models/types/database.types';

import { csrf } from '$lib/server/csrf';
import { db } from '$lib/server/database';

import type { RequestHandler } from './$types';

/**
 * Courses API Endpoint (/api/courses)
 *
 * This endpoint fetches a list of courses along with their corresponding
 * instructors. It's designed to retrieve course data for display in
 * a user interface, like a course catalog or dashboard.
 *
 * @method GET
 *
 * @param {Object} cookies - The cookies object from the request, used for CSRF validation.
 *
 * The endpoint first validates the CSRF token from the provided cookies.
 * Then, it retrieves a maximum of 20 courses from the database, including
 * details about each course and its instructor.
 *
 * The response includes data about courses and their instructors.
 *
 * @returns A JSON response containing an array of courses, each with
 *          associated instructor details, or an error message in case
 *          of CSRF validation failure.
 *
 * @example
 * // Typical JSON response
 * [
 *   {
 *     "id": 1,
 *     "title": "Introduction to Programming",
 *     "description": "An entry-level course on programming concepts",
 *     // ...other Course fields,
 *     "Instructor": {
 *       "id": 102,
 *       "name": "Jane Doe",
 *       // ...other User fields
 *     }
 *   },
 *   // ...more courses
 * ]
 *
 * Response headers include cache-control directives and content type.
 */
export const GET = (async ({ cookies }) => {
    await csrf.validateCookies(cookies);

    const courseResult = await db
        .selectFrom('Course')
        .innerJoin('User as Instructor', 'Course.instructorId', 'Instructor.id')
        .selectAll('Course')
        .selectAll('Instructor')
        .limit(20)
        .execute();

    const coursesWithInstructors = courseResult as (Course & User)[];

    const json = JSON.stringify(coursesWithInstructors);

    return new Response(json, {
        headers: {
            'cache-control': 'public, max-age=3600',
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}) satisfies RequestHandler;
