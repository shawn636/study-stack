import type { PageServerLoad } from './$types';
import type Category from '$lib/models/category';
import { ApiRouter } from '$lib/api-router';

export const load = (async () => {
	try {
		const router = new ApiRouter();
		const response = await fetch(router.url('top-categories'));
		const categories: Category[] = await response.json();

		return { categories };
	} catch (error) {
		console.error('Error loading top categories', error);
		return { categories: [] as Category[] };
	}
}) satisfies PageServerLoad;
