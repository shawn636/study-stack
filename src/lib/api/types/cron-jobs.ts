/**
 * GET /cron-jobs/session-cleanup
 * Start a cron job to clean up expired sessions.
 *   - All cron jobs are run in the background and do not return a response.
 *   - They all use the same result type
 */

import type { ApiResponse } from './common';

export type CronJobGetResponse = ApiResponse<null>;
