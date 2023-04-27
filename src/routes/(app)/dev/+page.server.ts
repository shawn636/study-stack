import type { PageServerLoad } from './$types';
import { PUBLIC_BASE_URL } from '$env/static/public';
import type Category from '$lib/models/category';

export const load = (async () => {
	// For production, Use this version, which uses the vercel cloud function
	// const response = await fetch(`${PUBLIC_BASE_URL}/api/top-categories`);

	// For development, Use this version, which uses the svelte api endpoint
	const response = await fetch(`${PUBLIC_BASE_URL}/svelte/api/top-categories`);

	const categories: Category[] = await response.json();

	return { categories };
}) satisfies PageServerLoad;
