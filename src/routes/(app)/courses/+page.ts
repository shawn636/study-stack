import type { Course, User } from '@prisma/client';

import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
    const res = await fetch('/api/courses');
    const coursesWithInstructors: { course: Course; instructor: User }[] = await res.json();
    return { coursesWithInstructors };
}) satisfies PageLoad;
