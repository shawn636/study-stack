import type { Course, User } from '$lib/models/types/database.types';

import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    try {
        const response = await fetch(`/api/courses/${params.slug}`);
        const courseWithInstructor = (await response.json()) as Course & User;
        return { courseWithInstructor };
    } catch (error) {
        console.error('Error loading top categories', error);
        return { course: null };
    }
}) satisfies PageLoad;
