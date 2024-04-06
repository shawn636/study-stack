/**
 * @vitest-environment jsdom
 */
import type CategorySummary from '$lib/models/types/category-summary';

import { db, sql } from '$lib/server/database';

describe('top-categories', () => {
    it('should be able to communicate with database', async () => {
        expect(db).toBeTruthy();

        interface ServerDate {
            serverDate: Date;
        }

        const { rows } = await sql<ServerDate>`SELECT NOW() as serverDate`.execute(db);

        expect(rows).toHaveLength(1);
        const serverDate = rows[0].serverDate;
        expect(serverDate).toBeTruthy();
    });

    it('should return the top 6 catgories', async () => {
        const response = await fetch('http://localhost:3004/api/top-categories');
        expect(response.status).toBe(200);

        let categorySummaries: CategorySummary[] = await response.json();

        expect(categorySummaries).toBeTruthy();

        categorySummaries = categorySummaries.map((categorySummary: CategorySummary) => {
            return {
                count: Number(categorySummary.count),
                imgHref: categorySummary.imgHref,
                title: categorySummary.title
            };
        });

        expect(categorySummaries.length).toBe(6);

        for (const categorySummary of categorySummaries) {
            expect(categorySummary.title).toBeTruthy();
            expect(typeof categorySummary.title).toBe('string');

            expect(categorySummary.count).toBeTruthy();
            expect(categorySummary.count).toBeGreaterThanOrEqual(1);

            expect(categorySummary.imgHref).toBeTruthy();
            expect(typeof categorySummary.imgHref).toBe('string');
        }
    });
});
