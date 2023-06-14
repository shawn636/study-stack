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
        expect(result.rows[0]).toContain({ solution: '2' });
    });
});
