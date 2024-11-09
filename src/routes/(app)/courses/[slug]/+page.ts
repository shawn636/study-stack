// src/routes/(app)/courses/[slug]/+page.ts
import type { Course, User } from '$lib/models/types/database.types';
import type { Selectable } from 'kysely';

import { apiClientSingleton as client } from '$lib/api';

import type { PageLoad } from './$types';

export const load = (async ({ fetch, params, parent }) => {
    let course: Selectable<Course> | null = null;
    let instructor: Selectable<User> | null = null;

    try {
        const courseResponse = await client.courses.getCourse(params.slug, fetch);

        if (!courseResponse.success) {
            throw new Error('Failed to load course or instructor');
        }
        course = courseResponse.data.course;
        instructor = courseResponse.data.instructor;
    } catch (error) {
        console.error('Error loading top categories', error);
        return { course: null, instructor: null };
    }

    await parent();
    return { course, instructor };
}) satisfies PageLoad;
