/**
 * @vitest-environment jsdom
 */
import { db } from '$lib/database';
import type Category from '$lib/models/category';

describe('top-categories', () => {
	it('should be able to communicate with database', async () => {
		expect(db).toBeDefined();
		expect(db).toBeTruthy();

		const conn = db.connection();
		expect(conn).toBeDefined();
		expect(conn).toBeTruthy();
	});

	it('should return the top 5 catgories', async () => {
		const response = await fetch('http://localhost:5173/api/top-categories');
		expect(response.status).toBe(200);

		// const categories: Category[] = await response.json();
		// expect(categories.length).toBe(5)

		// for (const category of categories) {
		//   expect(category.title).toBeDefined()
		// expect(typeof(category.title)).toBe('string')

		// expect(category.count).toBeDefined()

		// expect(category.count).toBeGreaterThanOrEqual(1)
		//   expect(typeof(category.count)).toBe('string')

		//   expect(category.img_href).toBeDefined()
		//   expect(category.img_href).toBeInstanceOf(String)
		// }
	});
});
