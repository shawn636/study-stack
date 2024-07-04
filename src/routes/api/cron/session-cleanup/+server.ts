import type { SessionCleanupGetResponse } from '$lib/api/types/cron-jobs';

import { handleErrors } from '$lib/server/error-handling';

import type { RequestHandler } from './$types';

import { deleteAuthSessions, deleteCsrfTokens } from './util';

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
        const [csrfTokensFlushed, authSessionsFlushed] = await Promise.all([
            deleteCsrfTokens(),
            deleteAuthSessions()
        ]);

        const response: SessionCleanupGetResponse = {
            count: 1,
            data: { authSessionsFlushed, csrfTokensFlushed },
            object: 'CronJob',
            success: true
        };

        return new Response(JSON.stringify(response), {
            headers: {
                'content-type': 'application/json;charset=UTF-8'
            },
            status: 200
        });
    } catch (error) {
        return handleErrors(error);
    }
};
