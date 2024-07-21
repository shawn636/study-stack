/**
 * DELETE /test-records
 * Delete all test records from the database.
 */

import type { ApiResponse } from './common';
type DeletionResults = { [key: string]: number };
export type TestRecordsDeleteResponse = ApiResponse<DeletionResults>;
