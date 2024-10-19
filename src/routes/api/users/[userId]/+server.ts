import type { User } from '$lib/models/types/database.types';
import type { UserUpdateResponse } from '$lib/api/types/users';

import { auth } from '$lib/server/auth';
import { DatabaseError } from '$lib/server/error-handling/handled-errors';
import { db } from '$lib/server/database';
import { handleErrors } from '$lib/server/error-handling';

import type { RequestHandler } from './$types';

export const PUT = (async ({ cookies, params, request }) => {
    try {
        const userIdSlug = params.userId;

        await auth.validateApiSession(cookies, userIdSlug);

        const userFromRequest: User = await request.json();

        const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            authUserId,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            id,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            organizationId,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            recordType,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            role,
            ...userFromRequestWithoutForeignKeys
        } = userFromRequest;

        try {
            await db
                .updateTable('User')
                .set({
                    ...userFromRequestWithoutForeignKeys
                })
                .where('id', '=', userIdSlug)
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
