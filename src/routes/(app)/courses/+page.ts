import type { CourseSearchResult } from '$lib/models/types/api';

import {
    type CourseSortByOption,
    CourseSortByOptions
} from '$lib/models/types/course-sort-by-options';

import type { PageLoad } from './$types';

const sortByValue: CourseSortByOption = CourseSortByOptions.RELEVANCE;

export const load = (async ({ fetch }) => {
    const response = await fetch(
        `/api/search/courses?sort_by=${sortByValue.param}&page=1&page_size=20`
    );
    const result: CourseSearchResult = await response.json();
    return result;
}) satisfies PageLoad;
