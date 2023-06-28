import type { PageLoad } from './$types';
import type Course from '$lib/models/course';

export const load = (async ({ fetch }) => {
    const res = await fetch('/api/courses');
    const courses = (await res.json()) as Course[];
    return { courses };
}) satisfies PageLoad;
