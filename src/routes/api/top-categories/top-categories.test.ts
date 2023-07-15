/**
 * @vitest-environment jsdom
 */
import { db } from '$lib/server/database';
import type Category from '$lib/models/category';

describe('top-categories', () => {
    it('should be able to communicate with database', async () => {
        expect(db).toBeDefined();
        expect(db).toBeTruthy();

        const conn = db.connection();
        expect(conn).toBeDefined();
        expect(conn).toBeTruthy();
    });

    it('should return the top 6 catgories', async () => {
        const response = await fetch('http://localhost:3000/api/top-categories');
        expect(response.status).toBe(200);

        let categories = await response.json();

        categories = categories.map(
            (category: { title: string; count: string; img_href: string }) => {
                return {
                    title: category.title,
                    count: parseInt(category.count),
                    img_href: category.img_href
                } as Category;
            }
        );

        expect(categories.length).toBe(6);

        for (const category of categories) {
            expect(category.title).toBeDefined();
            expect(category.title).toBeTruthy();
            expect(typeof category.title).toBe('string');

            expect(category.count).toBeDefined();
            expect(category.count).toBeTruthy();
            expect(typeof category.count).toBe('number');
            expect(category.count).toBeGreaterThanOrEqual(1);

            expect(category.img_href).toBeDefined();
            expect(category.img_href).toBeTruthy();
            expect(typeof category.img_href).toBe('string');
        }
    });
});
