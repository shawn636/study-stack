/**
 * @vitest-environment jsdom
 */

import { csrf } from '$lib/server/csrf';

describe('csrf', () => {
	it('should be able to generate and validate a csrf token', async () => {
		for (let i = 0; i < 10; i++) {
			const token = await csrf.generateToken();
			expect(token).toBeTruthy();
			if (token) {
				const isValid = await csrf.validateToken(token);
				expect(isValid).toBe(true);
			}
		}
	});
});
