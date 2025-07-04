import type { AdminSettingsUpdateResponse } from '$lib/api/types/admin-settings';

import { auth } from '$lib/server/auth';
import { DatabaseError } from '$lib/server/error-handling/handled-errors';
import { db } from '$lib/server/database';
import { handleErrors } from '$lib/server/error-handling';
import { InvalidRequestError } from '$lib/server/error-handling/handled-errors';

import type { RequestHandler } from './$types';

export const PATCH = (async ({ cookies, params, request }) => {
    try {
        await auth.validateApiSession(cookies, undefined, 'ADMIN');

        const body = await request.json();
        const key = params.slug;

        if (!body || !('setting' in body) || !key) {
            throw new InvalidRequestError('Invalid request. Please provide settings to update.');
        }

        if (!body.setting.key || !body.setting.value || !body.setting.recordType) {
            throw new InvalidRequestError(
                'Invalid request. Setting must have values for key, value, and recordType.'
            );
        }
        let matchingSettingCount = 0;
        try {
            const dbResult = await db
                .selectFrom('SiteSetting')
                .select(({ fn }) => [fn.count<number>('key').as('settingCount')])
                .where('SiteSetting.key', '=', key)
                .executeTakeFirstOrThrow();
            matchingSettingCount = dbResult.settingCount;
        } catch (e) {
            throw new DatabaseError('Failed to retrieve setting from database.');
        }

        let updatedOrInsertedCount = 0;
        try {
            if (matchingSettingCount === 0) {
                const result = await db
                    .insertInto('SiteSetting')
                    .values([body.setting])
                    .executeTakeFirstOrThrow();
                updatedOrInsertedCount += Number(result.numInsertedOrUpdatedRows ?? 0);
            } else {
                const result = await db
                    .updateTable('SiteSetting')
                    .set(body.setting)
                    .where('key', '=', key)
                    .executeTakeFirstOrThrow();
                updatedOrInsertedCount += Number(result.numUpdatedRows ?? 0);
            }
        } catch {
            throw new DatabaseError('Failed to update setting in database.');
        }

        const settingUpdated = updatedOrInsertedCount === 1;

        const result: AdminSettingsUpdateResponse = {
            count: updatedOrInsertedCount,
            data: null,
            message: settingUpdated
                ? 'Settings updated or inserted successfully.'
                : 'Failed to update setting.',
            object: 'SiteSetting',
            success: settingUpdated
        };

        return new Response(JSON.stringify(result), {
            status: settingUpdated ? 200 : 500
        });
    } catch (e) {
        console.log(`Error in GET /api/settings: ${e}`);
        return handleErrors(e);
    }
}) satisfies RequestHandler;
