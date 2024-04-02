/**
 * @vitest-environment jsdom
 */

import { db, sql } from '$lib/server/database';

describe('database', () => {
    it('should be able to connect to the database', async () => {
        expect(db).toBeTruthy();

        const result = await sql<{ solution: number }>`select 1 + 1 as solution`.execute(db);

        expect(result.rows).toHaveLength(1);
        expect(Number(result.rows[0].solution)).toBe(2);
    });
});
