import type Course from '$lib/models/course';

import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
    const res = await fetch('/api/courses');
    const courses = (await res.json()) as Course[];
    return { courses };
}) satisfies PageLoad;
