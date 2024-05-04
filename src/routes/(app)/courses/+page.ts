import type { CourseSearchResult } from '$lib/models/types/api';

import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
    const response = await fetch('/api/search/courses?page=0&page_size=12&sort_by=relevance', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'GET'
    });

    const result = (await response.json()) as CourseSearchResult;

    return { result: result };
}) satisfies PageLoad;
