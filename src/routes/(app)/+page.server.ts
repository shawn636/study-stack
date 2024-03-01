import type Category from '$lib/models/category';

import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
    try {
        const response = await fetch('/api/top-categories');
        const categories: Category[] = await response.json();

        return { categories };
    } catch (error) {
        console.error('Error loading top categories', error);
        return { categories: [] as Category[] };
    }
}) satisfies PageServerLoad;
