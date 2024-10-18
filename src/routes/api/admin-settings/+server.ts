import type { AdminSettingsGetMultipleResponse } from '$lib/api/types/admin-settings';
import type { RequestHandler } from './$types';

import { auth } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { handleErrors } from '$lib/server/error-handling';
import { InvalidRequestError } from '$lib/server/error-handling/handled-errors';
import { RecordType } from '$lib/models/types/database.types';

/**
 * Retrieves the specified settings from the database.
 *
 * @param cookies - The cookies included in the request.
 * @param url - The URL object representing the request URL.
 * @returns A Response object containing the retrieved settings.
 */
export const GET = (async ({ cookies, url }) => {
    try {
        const userId = undefined;
        const userRole = 'ADMIN';

        await auth.validateApiSession(cookies, userId, userRole);

        const params = url.searchParams;
        const settingsToRetrieve = params.getAll('settings');

        if (
            !settingsToRetrieve ||
            !Array.isArray(settingsToRetrieve) ||
            settingsToRetrieve.length === 0
        ) {
            throw new InvalidRequestError('Invalid request. Please provide settings to retrieve.');
        }

        const settingsFromDB = await db
            .selectFrom('SiteSetting')
            .select(['SiteSetting.siteSettingKey', 'SiteSetting.siteSettingValue'])
            .where('siteSettingKey', 'in', settingsToRetrieve)
            .where('siteSettingRecordType', '=', RecordType.PRODUCTION_RECORD)
            .execute();

        const settingKeys = settingsFromDB.map((setting) => setting.siteSettingKey);

        if (settingsToRetrieve.length !== settingKeys.length) {
            const missingSettings = settingsToRetrieve.filter(
                (setting: string) => !settingKeys.includes(setting)
            );
            throw new InvalidRequestError(
                `Invalid request. The following settings do not exist: ${missingSettings.join(', ')}`
            );
        }

        const result: AdminSettingsGetMultipleResponse = {
            count: settingsFromDB.length,
            data: settingsFromDB,
            object: 'SiteSetting',
            success: true
        };

        return new Response(JSON.stringify(result), {
            status: 200
        });
    } catch (e) {
        return handleErrors(e);
    }
}) satisfies RequestHandler;
