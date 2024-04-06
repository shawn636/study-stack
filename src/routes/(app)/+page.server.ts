import type CategorySummary from '$lib/models/types/category-summary';

import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
    try {
        const response = await fetch('/api/top-categories');
        const categorySummaries: CategorySummary[] = await response.json();
        return { categorySummaries };
    } catch (error) {
        console.error('Error loading top categories', error);
        return { categorySummaries: [] as CategorySummary[] };
    }
}) satisfies PageServerLoad;
