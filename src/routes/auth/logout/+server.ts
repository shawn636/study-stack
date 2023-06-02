import type { RequestHandler } from './$types';
import { auth } from '$lib/server/lucia';

export const POST = (async ({ locals }) => {
	const headers = new Headers();
	const { session } = await locals.auth.validateUser();

	if (!session) {
		return new Response(null, {
			status: 400,
			headers
		});
	}
	await auth.invalidateSession(session.sessionId);
	await locals.auth.setSession(null);

	headers.set('location', '/auth/login');
	return new Response(null, {
		status: 302,
		headers
	});
}) satisfies RequestHandler;
