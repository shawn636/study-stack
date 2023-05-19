/**
 * @vitest-environment jsdom
 */
import { ApiRouter } from '$lib/api-router';
import { db } from '$lib/database';
import type Category from '$lib/models/category';

describe('top-categories', () => {
	it('should provide url based on env variables', () => {
		const router = new ApiRouter();
		expect(router).toBeDefined();
	});
});
