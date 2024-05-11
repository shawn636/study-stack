import type CategorySummary from '$lib/models/types/category-summary';

import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
    try {
        const _slug = params.slug;
        // const response = await fetch(`/api/course/${slug}`);
    } catch (error) {
        console.error('Error loading top categories', error);
        return { categorySummaries: [] as CategorySummary[] };
    }
}) satisfies PageLoad;
