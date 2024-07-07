import {
    type CourseSortByOption,
    CourseSortByOptions
} from '$lib/models/types/course-sort-by-options';
import { handleErrors } from '$lib/server/error-handling';

import type { RequestHandler } from './$types';

import { getCourses } from './fetch-courses';

export const GET = (async ({ url }) => {
    try {
        const defaultSortByValue: CourseSortByOption = CourseSortByOptions.RELEVANCE;

        const searchTerm = url.searchParams.get('query');
        const pageNo = Number(url.searchParams.get('page') ?? '1');
        const pageSize = Number(url.searchParams.get('page_size') ?? '20');
        const sortByParam = url.searchParams.get('sort_by') ?? defaultSortByValue.param;
        const userId = url.searchParams.get('user_id') ?? undefined;

        const response = await getCourses(searchTerm, pageNo, pageSize, sortByParam, userId);

        if (!response) {
            throw new Error('Failed to retrieve courses');
        }

        return response;
    } catch (e) {
        return handleErrors(e);
    }
}) satisfies RequestHandler;
