import type { RequestHandler } from './$types';
import { db } from '$lib/database';

export const GET = (({ url }) => {
	const conn = db.connection();

	return new Response(`id: ${url.searchParams.get('id')}`);
}) satisfies RequestHandler;
