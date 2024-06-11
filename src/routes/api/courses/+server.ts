import {
    type CourseSortByOption,
    CourseSortByOptions
} from '$lib/models/types/course-sort-by-options';
import { csrf } from '$lib/server/csrf';

import type { RequestHandler } from './$types';

import { getCourses } from './fetch-courses';

export const GET = (async ({ cookies, url }) => {
    await csrf.validateCookies(cookies);

    const defaultSortByValue: CourseSortByOption = CourseSortByOptions.RELEVANCE;

    const searchTerm = url.searchParams.get('query');
    const pageNo = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('page_size') ?? '20');
    const sortByParam = url.searchParams.get('sort_by') ?? defaultSortByValue.param;

    const response = await getCourses(searchTerm, pageNo, pageSize, sortByParam);

    if (!response) {
        return new Response(null, { status: 500 });
    }

    return response;
}) satisfies RequestHandler;
