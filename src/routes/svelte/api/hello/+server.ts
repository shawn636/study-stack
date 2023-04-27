import { faker } from '@faker-js/faker';
import type { RequestHandler } from './$types';

export const GET = (() => {
	return new Response(`Hello, from ${faker.name.firstName()} I'm now an Edge Function!`);
}) satisfies RequestHandler;
