import type { Course, User } from '$lib/models/types/database.types';

import { SortBy, type SortByValue } from '$lib/models/types/sort-by';

import type { PageLoad } from './$types';

const sortByValue: SortByValue = SortBy.RELEVANCE;

export const load = (async ({ fetch }) => {
    const res = await fetch(`/api/search?sort_by=${sortByValue.param}`);
    const coursesWithInstructors: (Course & User)[] = await res.json();
    return { coursesWithInstructors };
}) satisfies PageLoad;
