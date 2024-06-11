import type { AdminSettingsUpdateResponse } from '$lib/api/types/admin-settings';

import { auth } from '$lib/server/auth';
import { db, sql } from '$lib/server/database';
import { HandledError, handleErrors } from '$lib/server/util';

import type { RequestHandler } from './$types';

class UnauthorizedError extends HandledError {
    constructor(message: string) {
        super(message);
        this.statusCode = 401;
        this.name = 'UnauthorizedError';
    }
}

class InvalidRequestError extends HandledError {
    constructor(message: string) {
        super(message);
        this.statusCode = 400;
        this.name = 'InvalidRequestError';
    }
}

export const PATCH = (async ({ cookies, request }) => {
    try {
        const sessionId = auth.getSession(cookies);
        const isValid = await auth.validateSession(sessionId ?? '');

        if (!isValid) {
            throw new UnauthorizedError('Unauthorized');
        }

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
