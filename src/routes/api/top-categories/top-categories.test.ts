/**
 * @vitest-environment jsdom
 */
import type CategorySummary from '$lib/models/category-summary';

import { prisma } from '$lib/server/database';

describe('top-categories', () => {
    it('should be able to communicate with database', async () => {
        expect(prisma).toBeDefined();
        expect(prisma).toBeTruthy();

        interface ServerDate {
            serverDate: Date;
        }
        const results: ServerDate[] = await prisma.$queryRaw`SELECT NOW() as serverDate`;
        const serverDate = results[0].serverDate;

        expect(serverDate).toBeDefined();
        expect(serverDate).toBeTruthy();
    });

    it('should return the top 6 catgories', async () => {
        const response = await fetch('http://localhost:3004/api/top-categories');
        expect(response.status).toBe(200);

        let categorySummaries: CategorySummary[] = await response.json();

        expect(categorySummaries).toBeDefined();
        expect(categorySummaries).toBeTruthy();

        categorySummaries = categorySummaries.map((categorySummary: CategorySummary) => {
            return {
                count: categorySummary.count,
                imgHref: categorySummary.imgHref,
                title: categorySummary.title
            };
        });

        expect(categorySummaries.length).toBe(6);

        for (const categorySummary of categorySummaries) {
            expect(categorySummary.title).toBeDefined();
            expect(categorySummary.title).toBeTruthy();
            expect(typeof categorySummary.title).toBe('string');

            expect(categorySummary.count).toBeDefined();
            expect(categorySummary.count).toBeTruthy();
            expect(typeof categorySummary.count).toBe('number');
            expect(categorySummary.count).toBeGreaterThanOrEqual(1);

            expect(categorySummary.imgHref).toBeDefined();
            expect(categorySummary.imgHref).toBeTruthy();
            expect(typeof categorySummary.imgHref).toBe('string');
        }
    });
});
