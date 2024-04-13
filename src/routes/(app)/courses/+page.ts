import type { Course, User } from '$lib/models/types/database.types';

import {
    type CourseSortByOption,
    CourseSortByOptions
} from '$lib/models/types/course-sort-by-options';

import type { PageLoad } from './$types';

const sortByValue: CourseSortByOption = CourseSortByOptions.RELEVANCE;

export const load = (async ({ fetch }) => {
    const res = await fetch(`/api/search?sort_by=${sortByValue.param}`);
    const coursesWithInstructors: (Course & User)[] = await res.json();
    return { coursesWithInstructors };
}) satisfies PageLoad;
