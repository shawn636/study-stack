/**
 * @vitest-environment jsdom
 */

import { prisma } from './database';

describe('database', () => {
    it('should be able to connect to the database', async () => {
        expect(prisma).toBeTruthy();

        interface Result {
            solution: number;
        }

        const result: Result[] = await prisma.$queryRaw`SELECT 1 + 1 as solution`;

        expect(result.length).toBe(1);
        const num: number = Number(result[0]?.solution) ?? -1;
        expect(num).toBe(2);
    });
});
