import type { UserUpdateResponse } from '$lib/api/types/users';
import type { User } from '$lib/models/types/database.types';

import { auth } from '$lib/server/auth';
import { csrf } from '$lib/server/csrf';
import { db } from '$lib/server/database';
import { handleErrors } from '$lib/server/error-handling';
import { DatabaseError } from '$lib/server/error-handling/handled-errors';

import type { RequestHandler } from './$types';

export const PUT = (async ({ cookies, params, request }) => {
    try {
        const userIdSlug = params.userId;

        await csrf.validateCookies(cookies);
        await auth.validateApiSession(cookies, userIdSlug);

        const userFromRequest: User = await request.json();

        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            userAuthUserId,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            userId,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            userOrganizationId,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            userRecordType,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            userRole,
            ...userFromRequestWithoutForeignKeys
        } = userFromRequest;

        try {
            await db
                .updateTable('User')
                .set({
                    ...userFromRequestWithoutForeignKeys
                })
                .where('userId', '=', userIdSlug)
                .execute();
        } catch (e) {
            throw new DatabaseError(`Unable to update due to server error: ${e}`);
        }

        const responsePayload: UserUpdateResponse = {
            count: 1,
            data: userFromRequest,
            message: 'User updated successfully.',
            object: 'User',
            success: true
        };

        return new Response(JSON.stringify(responsePayload), {
            status: 200
        });
    } catch (e) {
        console.error(e);
        return handleErrors(e);
    }
}) satisfies RequestHandler;
