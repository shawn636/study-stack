import { CourseSortByOptions } from '$lib/models/types/course-sort-by-options';
import { csrf } from '$lib/server/csrf';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { getCourses, searchParamsAreValid } from './fetch-courses';

export const GET = (async ({ cookies, url }) => {
    await csrf.validateCookies(cookies);

    const requiredSearchParams = ['page', 'page_size', 'sort_by'];

    if (!searchParamsAreValid(url.searchParams, requiredSearchParams)) {
        return error(400, 'Invalid search parameters');
    }

    const pageNo = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('page_size') ?? '20');
    const sortByParam = url.searchParams.get('sort_by') ?? CourseSortByOptions.RELEVANCE.param;

    const response = await getCourses(null, pageNo, pageSize, sortByParam);

    if (!response) {
        console.error('Failed to fetch courses');
        return error(500, 'Failed to fetch courses');
    }

    return response;
}) satisfies RequestHandler;
