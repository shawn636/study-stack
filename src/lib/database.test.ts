/**
 * @vitest-environment jsdom
 */

import { db } from './database';

describe('database', () => {
	it('should be able to connect to the database', async () => {
		expect(db).toBeTruthy();
		const connection = db.connection();
		expect(connection).toBeTruthy();
		expect(connection.execute('SELECT 1 + 1 AS solution')).resolves.toEqual(
			expect.arrayContaining([{ solution: 2 }])
		);
	});
});
