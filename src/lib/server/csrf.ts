import { db } from '$lib/database';
import { v4 as uuidv4 } from 'uuid';

export class csrf {
	public static validateToken = async (token: string) => {
		const conn = db.connection();
		try {
			const result = await conn.execute(
				'SELECT * FROM csrf_token WHERE token = ? AND expires > CURRENT_TIMESTAMP;',
				[token]
			);
			return result.rows.length > 0;
		} catch (e) {
			console.error('Something went wrong while validating token');
			return false;
		}
	};

	public static generateToken = async () => {
		const newToken: string = uuidv4();
		const conn = db.connection();
		try {
			await conn.execute(
				'INSERT INTO csrf_token (token, expires) VALUES (?, DATE_ADD(NOW(), INTERVAL 30 DAY)   );',
				[newToken]
			);
			return newToken;
		} catch (e) {
			console.log(e);
			console.error('Unable to insert token into database');
			return null;
		}
	};
}
