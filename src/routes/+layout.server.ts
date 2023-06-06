import type { LayoutServerLoad } from './$types';
import { csrf } from '$lib/server/csrf';

export const load = (async ({ cookies }) => {
	const token = cookies.get('csrf-token');
	const is_valid = await csrf.validateToken(token ?? '');
	if (!is_valid) {
		const token = await csrf.generateToken();
		if (token) {
			cookies.set('csrf-token', token, {
				path: '/',
				httpOnly: false,
				secure: false
			});
		} else {
			console.error('Unable to store csrf token in cookie');
		}
	}
}) satisfies LayoutServerLoad;
