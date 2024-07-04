import type { AdminSettingsUpdateResponse } from '$lib/api/types/admin-settings';

import { auth } from '$lib/server/auth';
import { csrf } from '$lib/server/csrf';
import { db, sql } from '$lib/server/database';
import { handleErrors } from '$lib/server/error-handling';
import { InvalidRequestError } from '$lib/server/error-handling/handled-errors';

import type { RequestHandler } from './$types';

export const PATCH = (async ({ cookies, request }) => {
    try {
        await auth.validateApiSession(cookies, 'ADMIN');
        await csrf.validateCookies(cookies);

        const body = await request.json();

        if (
            !body ||
            !body.includes('settings') ||
            !Array.isArray(body.settings) ||
            body.settings.length === 0
        ) {
            throw new InvalidRequestError('Invalid request. Please provide settings to update.');
        }

        for (const setting of body.settings) {
            if (
                !setting.siteSettingKey ||
                !setting.siteSettingValue ||
                !setting.siteSettingRecordType
            ) {
                throw new InvalidRequestError(
                    'Invalid request. Each setting must have values for siteSettingKey, siteSettingValue, and siteSettingRecordType.'
                );
            }
        }

        const dbResult = await db
            .insertInto('SiteSetting')
            .values(body.settings)
            .onDuplicateKeyUpdate({
                siteSettingKey: sql`VALUES(siteSettingKey)`,
                siteSettingRecordType: sql`VALUES(siteSettingRecordType)`,
                siteSettingValue: sql`VALUES(siteSettingValue)`
            })
            .executeTakeFirstOrThrow();

        const updatedOrInsertedCount = Number(dbResult.numInsertedOrUpdatedRows ?? 0);
        const allSettingsUpdated = updatedOrInsertedCount === body.settings.length;

        const result: AdminSettingsUpdateResponse = {
            count: Number(dbResult.numInsertedOrUpdatedRows ?? 0),
            data: null,
            message: allSettingsUpdated
                ? 'Settings updated or inserted successfully.'
                : 'Some settings failed to update or insert.',
            object: 'SiteSetting',
            success: allSettingsUpdated
        };

        return new Response(JSON.stringify(result), {
            status: allSettingsUpdated ? 200 : 500
        });
    } catch (e) {
        console.log(`Error in GET /api/settings: ${e}`);
        return handleErrors(e);
    }
}) satisfies RequestHandler;
