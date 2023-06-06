import type { RequestHandler } from './$types';
import { auth } from '$lib/server/lucia';
import { csrf } from '$lib/server/csrf';

export const POST = (async ({ request, cookies, locals }) => {
	const { sessionId } = await request.json();

	const token = request.headers.get('x-csrf-token') as string;
	const valid_token = await csrf.validateToken(token);
	if (!valid_token) {
		return new Response('Cross-site form submissions are forbidden.', {
			status: 403
		});
	}

	if (!sessionId) {
		return new Response(null, {
			status: 400
		});
	}
	await auth.invalidateSession(sessionId);
	locals.auth.setSession(null);
	cookies.delete('auth_session');

	return new Response(null, {
		status: 302
	});
}) satisfies RequestHandler;
