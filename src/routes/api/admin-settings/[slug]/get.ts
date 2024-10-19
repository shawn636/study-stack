import type { AdminSettingsGetResponse } from '$lib/api/types/admin-settings';
import type { SiteSetting } from '$lib/models/types/database.types';

import {
    DatabaseError,
    InvalidRequestError,
    NotFoundError
} from '$lib/server/error-handling/handled-errors';

import { auth } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { handleErrors } from '$lib/server/error-handling';
import { RecordType } from '$lib/models/types/database.types';

import type { RequestHandler } from './$types';

export const GET = (async ({ cookies, params }) => {
    try {
        const userId = undefined;
        const userRole = 'ADMIN';

        await auth.validateApiSession(cookies, userId, userRole);

        const key = params.slug;

        if (!key) {
            throw new InvalidRequestError('Invalid request. Please provide setting to retrieve.');
        }

        let setting: SiteSetting | undefined;

        try {
            const settingResult = await db
                .selectFrom('SiteSetting')
                .selectAll()
                .where('key', '=', key)
                .where('recordType', '=', RecordType.PRODUCTION_RECORD)
                .executeTakeFirst();
            setting = settingResult as unknown as SiteSetting;
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
            }
            throw new DatabaseError('Failed to retrieve setting from database.');
        }

        if (!setting) {
            throw new NotFoundError('Setting not found.');
        }

        const result: AdminSettingsGetResponse = {
            count: 1,
            data: setting,
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
