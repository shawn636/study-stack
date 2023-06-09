import type { PageServerLoad } from './$types';
import type Category from '$lib/models/category';

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
