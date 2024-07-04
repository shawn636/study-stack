import { apiClientSingleton as client } from '$lib/api';

import type { PageLoad } from './$types';

export const load = (async ({ fetch, params, parent }) => {
    try {
        await parent();
        const courseResponse = await client.courses.getCourse(params.slug, fetch);

        if (!courseResponse.success) {
            throw new Error('Failed to load course or instructor');
        }

        return {
            course: courseResponse.data.course,
            instructor: courseResponse.data.instructor
        };
    } catch (error) {
        console.error('Error loading top categories', error);
        return { course: null, instructor: null };
    }
}) satisfies PageLoad;
