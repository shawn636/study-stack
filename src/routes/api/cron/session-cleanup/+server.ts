import { db } from '$lib/server/database';

import type { RequestHandler } from './$types';

/**
 * Session Cleanup API Endpoint (/api/cron/session-cleanup)
 *
 * This endpoint is responsible for cleaning up expired sessions and CSRF tokens
 * in the database. It is typically used as part of a scheduled job (cron) to
 * maintain the efficiency and security of the application.
 *
 * @method GET
 *
 * @returns A JSON response containing the count of deleted auth sessions
 *          and CSRF tokens, or an error message in case of failure.
 *
 * @example
 * // Response on success
 * {
 *   "authSessionsFlushed": 5,
 *   "csrfTokensFlushed": 7
 * }
 *
 * // Response on failure
 * "Internal Server Error"
 */
export const GET: RequestHandler = async () => {
    try {
        const [csrfFlush, authSessionFlush] = await Promise.all([
            db
                .deleteFrom('CsrfToken')
                .where('csrfTokenExpirationDate', '<=', new Date())
                .executeTakeFirst(),
            db
                .deleteFrom('AuthSession')
                .where('authSessionExpirationDate', '<=', new Date())
                .executeTakeFirst()
        ]);
        const json = JSON.stringify({
            authSessionsFlushed: Number(authSessionFlush.numDeletedRows),
            csrfTokensFlushed: Number(csrfFlush.numDeletedRows)
        });

        return new Response(json, {
            headers: {
                'content-type': 'application/json;charset=UTF-8'
            },
            status: 200
        });
    } catch (error) {
        console.error('An error occurred:', error);
        return new Response('Internal Server Error', {
            status: 500
        });
    }
};
