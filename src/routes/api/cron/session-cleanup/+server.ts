import type { SessionCleanupGetResponse } from '$lib/api/types/cron-jobs';

import { handleErrors } from '$lib/server/error-handling';

import type { RequestHandler } from './$types';

import { deleteAuthSessions } from './util';

/**
 * Session Cleanup API Endpoint (/api/cron/session-cleanup)
 *
 * This endpoint is responsible for cleaning up expired sessions
 * in the database. It is typically used as part of a scheduled job (cron) to
 * maintain the efficiency and security of the application.
 *
 * @method GET
 *
 * @returns A JSON response containing the count of deleted auth sessions
 *          or an error message in case of failure.
 *
 * @example
 * // Response on success
 * {
 *   "authSessionsFlushed": 5,
 * }
 *
 * // Response on failure
 * "Internal Server Error"
 */
export const GET: RequestHandler = async () => {
    try {
        const authSessionsFlushed = await deleteAuthSessions();

        const response: SessionCleanupGetResponse = {
            count: 1,
            data: { authSessionsFlushed },
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
