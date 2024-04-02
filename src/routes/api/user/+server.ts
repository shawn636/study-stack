import { auth } from '$lib/server/auth';
import { csrf } from '$lib/server/csrf';
import { type User, db } from '$lib/server/database';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

/**
 * User Update API Endpoint (/api/user)
 *
 * This PUT endpoint allows for updating a user's information in the database.
 * It is designed to handle user profile updates where authenticated users can
 * modify their own details.
 *
 * @method PUT
 *
 * @param {Object} cookies - The cookies object from the request. Used for CSRF validation
 *                           and session identification.
 * @param {Request} request - The PUT request object. Contains the JSON payload with the
 *                            user's updated information.
 *
 * The endpoint first validates the CSRF token from the cookies and retrieves the user's
 * session ID. It then fetches the user ID from the session and compares it with the user
 * ID in the request payload to ensure that the user is authorized to update their own profile.
 *
 * If the session is invalid (not logged in) or the user IDs do not match (unauthorized access),
 * the request is terminated with a 401 or 403 error respectively.
 *
 * The endpoint expects a JSON payload with the user's updated information, excluding any foreign keys.
 * The update is performed in the database, and in case of a server error during the update, a 500 error
 * is returned.
 *
 * @returns A 200 OK status response for a successful update, or an error message for
 *          invalid or unauthorized requests.
 *
 * @example
 * // PUT Request JSON Payload
 * {
 *   "user": {
 *     "id": "123",
 *     "name": "John Doe",
 *     "email": "johndoe@example.com",
 *     // ...other user fields
 *   }
 * }
 *
 * // Response on Success
 * HTTP Status 200 OK
 *
 * // Response on Failure
 * HTTP Status 401/403/500 with error message
 */
export const PUT = (async ({ cookies, request }) => {
    await csrf.validateCookies(cookies);
    const sessionId = auth.getSession(cookies);

    if (!sessionId) {
        error(401, 'You are not logged in.');
    }

    const [userIdFromSession, requestData] = await Promise.all([
        await auth.getUserId(sessionId),
        await request.json()
    ]);

    const userFromRequest: User = requestData.user;
    const userIdFromRequest: string = requestData.user.id;

    if (userIdFromRequest !== userIdFromSession) {
        error(403, 'You are not authorized to update this user.');
    }

    // Ignoring unused variables in order to remove foreign keys from the user object
    //
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authUserId, id, organizationId, ...userFromRequestWithoutForeignKeys } =
        userFromRequest;
    try {
        await db
            .updateTable('User')
            .set({
                ...userFromRequestWithoutForeignKeys
            })
            .where('id', '=', userIdFromRequest)
            .execute();
    } catch (e) {
        console.error(e);

        error(500, 'Unable to update due to server error.');
    }

    return new Response(null, {
        status: 200
    });
}) satisfies RequestHandler;
