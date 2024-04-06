import type { Course, User } from '$lib/models/types/database.types';

import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
    const res = await fetch('/api/courses');
    const coursesWithInstructors: (Course & User)[] = await res.json();
    return { coursesWithInstructors };
}) satisfies PageLoad;
