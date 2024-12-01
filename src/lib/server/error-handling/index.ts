import { error } from '@sveltejs/kit';
import { errorPadding } from '$lib/server/util';

import { HandledError } from './handled-errors';

/**
 * Centralized error handler for API endpoints in a SvelteKit application.
 *
 * This function is specifically designed for handling errors that occur within the
 * API routes. It ensures that all errors are processed
 * consistently and securely across the server-side environment. The function checks
 * for instances of `HandledError`, allowing the application to respond with tailored
 * HTTP status codes and error messages based on the type of error encountered.
 *
 * Errors that are not instances of `HandledError` are treated as unexpected internal
 * server errors. The function then defaults to sending a response with a 500 status
 * code and a generic error message, which helps safeguard the application's internals
 * and provides a uniform error response to the client.
 *
 * It is important to note that this function should only be used is server-side endpoints
 * to ensure proper error handling in API routes.
 *
 * Example Usage:
 * ```
 * // In an endpoint (e.g., src/routes/api/myendpoint.ts)
 * import { HandledError, handleErrors } from '$lib/server/util';
 *
 * class UnauthorizedError extends HandledError {
 *     constructor(message: string) {
 *         super(message);
 *         this.statusCode = 401;
 *         this.name = 'UnauthorizedError';
 *     }
 * }
 *
 * export const GET = async ({ cookies }) => {
 *     try {
 *         const sessionId = auth.getSession(cookies);
 *         const isValid = await auth.validateSession(sessionId ?? '');
 *         if (!isValid) {
 *             throw new UnauthorizedError('Unauthorized');
 *         }
 *         const result = { message: 'Success' };
 *         return new Response(JSON.stringify(result), {
 *             status: 200
 *         });
 *
 *     } catch (e) {
 *         return handleErrors(e);
 * }
 * ```
 */
export const handleErrors = async (e: unknown) => {
    await errorPadding();

    // Check if in testing environment
    if (process.env.NODE_ENV !== 'test') {
        console.error(e);
    }

    if (e instanceof SyntaxError) {
        return error(400, 'Invalid JSON');
    }

    if (e instanceof HandledError) {
        return error(e.statusCode, e.message);
    }

    return error(500, 'An unexpected error occurred.');
};
