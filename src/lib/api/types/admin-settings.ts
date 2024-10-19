/**
 * GET /admin-settings
 * Response to request for retrieving admin settings.
 *
 * PATCH /admin-settings
 * Response to request for updating admin settings.
 *
 * POST /admin-settings
 * Response to request for creating admin settings.
 */

import type { ApiResponse } from './common';

export interface AdminSetting {
    key: string;
    value: string;
}

export type AdminSettingsGetMultipleResponse = ApiResponse<AdminSetting[]>;
export type AdminSettingsGetResponse = ApiResponse<AdminSetting>;
export type AdminSettingsUpdateResponse = ApiResponse<null>;
