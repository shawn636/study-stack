import type { LayoutServerLoad } from './$types';
import { db } from '$lib/database';
import type User from '$lib/models/user';

export const load = (async ({ locals, cookies }) => {
	const { user, session } = await locals.auth.validateUser();
	const csrf_token = cookies.get('csrf-token');
	if (user) {
		const conn = db.connection();
		try {
			const user_result = await conn.execute(
				'SELECT auth_user_id as id, email, name FROM User WHERE auth_user_id = ?;',
				[user?.userId as string]
			);
			if (user_result.rows.length === 1) {
				const user_object: User = user_result.rows[0] as User;
				return { user: user_object, session, csrf_token };
			}
		} catch (e: unknown) {
			console.error('Unable to logged in User from database.');
		}
	}
	return { user, session, csrf_token };
}) satisfies LayoutServerLoad;
