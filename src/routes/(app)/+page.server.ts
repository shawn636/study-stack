import type CategorySummary from '$lib/models/types/category-summary';

import { apiClientSingleton as client } from '$lib/api';

import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
    try {
        const response = await client.categories.getTopCategories(fetch);
        return { categorySummaries: response.data };
    } catch (error) {
        console.error('Error loading top categories', error);
        return { categorySummaries: [] as CategorySummary[] };
    }
}) satisfies PageServerLoad;
