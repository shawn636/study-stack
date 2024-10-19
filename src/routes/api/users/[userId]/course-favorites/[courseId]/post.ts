import type { CourseFavoritesCreateResponse } from '$lib/api/types/users';

import { auth } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { handleErrors } from '$lib/server/error-handling';
import { InvalidRequestError } from '$lib/server/error-handling/handled-errors';

import type { RequestHandler } from './$types';

export const POST = (async ({ cookies, params }) => {
    try {
        const courseId = params.courseId;
        const userId = params.userId;

        await auth.validateApiSession(cookies, userId);

        if (!courseId) {
            throw new InvalidRequestError('Invalid course ID');
        }

        if (!userId) {
            throw new InvalidRequestError('Invalid user ID');
        }

        const result = await db
            .insertInto('CourseFavorite')
            .values({ courseId, userId })
            .ignore()
            .executeTakeFirstOrThrow();

        const created = Number(result.numInsertedOrUpdatedRows ?? 0) > 0;

        const responsePayload: CourseFavoritesCreateResponse = {
            count: 1,
            data: {
                created: created,
                message: created ? 'Course added to favorites' : 'Course already in favorites'
            },
            object: 'CourseFavorites',
            success: true
        };

        return new Response(JSON.stringify(responsePayload), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200
        });
    } catch (e) {
        return handleErrors(e);
    }
}) satisfies RequestHandler;
