/**
 * @vitest-environment jsdom
 */

import { PUBLIC_DEV_BASE_URL, PUBLIC_PROD_BASE_URL } from '$env/static/public';
import { ApiRouter } from './api-router';

describe('top-categories', () => {
	const original_env = process.env;

	beforeEach(() => {
		vitest.resetModules();
		process.env = { ...original_env };
	});

	afterAll(() => {
		process.env = original_env;
	});

	it('should use svelte api in dev env', () => {
		process.env.PUBLIC_ENV = 'DEV';
		const router = new ApiRouter();
		expect(router).toBeTruthy();

		const url = router.url('/');
		expect(url).toBe(`${PUBLIC_DEV_BASE_URL}/svelte/api/`);
	});

	it('should use vercel api in prod env', () => {
		process.env.PUBLIC_ENV = 'PROD';
		const router = new ApiRouter();
		expect(router).toBeTruthy();

		const url = router.url('/');
		expect(url).toBe(`${PUBLIC_PROD_BASE_URL}/api/`);
	});

	it('should accept endpoints with or without leading slash', () => {
		const router = new ApiRouter();
		const url1 = router.url('top-categories');
		const url2 = router.url('/top-categories');
		expect(url1).toBe(url2);
	});
});
