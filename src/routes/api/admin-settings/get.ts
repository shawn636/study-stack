import type { AdminSettingsGetResponse } from '$lib/api/types/admin-settings';

import { RecordType } from '$lib/models/types/database.types';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { HandledError, handleErrors } from '$lib/server/util';

import type { RequestHandler } from './$types';

/**
 * Represents an error that occurs when a user is unauthorized to access a resource.
 */
class UnauthorizedError extends HandledError {
    constructor(message: string) {
        super(message);
        this.statusCode = 401;
        this.name = 'UnauthorizedError';
    }
}

/**
 * Represents an error that occurs when an invalid request is made.
 */
class InvalidRequestError extends HandledError {
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = 'InvalidRequestError';
    }
}

/**
 * Retrieves the specified settings from the database.
 *
 * @param cookies - The cookies included in the request.
 * @param url - The URL object representing the request URL.
 * @returns A Response object containing the retrieved settings.
 */
export const GET = (async ({ cookies, url }) => {
    try {
        const sessionId = auth.getSession(cookies);
        const isValid = await auth.validateSession(sessionId ?? '');

        if (!isValid) {
            throw new UnauthorizedError('Unauthorized');
        }

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

        const result: AdminSettingsGetResponse = {
            count: settingsFromDB.length,
            data: settingsFromDB,
            object: 'SiteSetting',
            success: true
        };

        return new Response(JSON.stringify(result), {
            status: 200
        });
    } catch (e) {
        console.log(`Error in GET /api/settings: ${e}`);
        return handleErrors(e);
    }
}) satisfies RequestHandler;
