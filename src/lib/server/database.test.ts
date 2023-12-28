/**
 * @vitest-environment jsdom
 */

import { db } from './database';

describe('database', () => {
    it('should be able to connect to the database', async () => {
        expect(db).toBeTruthy();
        const connection = db.connection();
        expect(connection).toBeTruthy();
        const result = await connection.execute('SELECT 1 + 1 as solution');

        const solution = parseInt(result.rows[0].solution) || null;
        expect(solution).toBe(2);
    });
});
