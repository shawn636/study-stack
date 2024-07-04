import type { UserCourseFavoritesCreateResponse } from '$lib/api/types/users';

import { auth } from '$lib/server/auth';
import { csrf } from '$lib/server/csrf';
import { db } from '$lib/server/database';
import { handleErrors } from '$lib/server/error-handling';
import { InvalidRequestError } from '$lib/server/error-handling/handled-errors';

import type { RequestHandler } from './$types';

export const POST = (async ({ cookies, params }) => {
    try {
        const userCourseFavoriteCourseId = params.courseId;
        const userCourseFavoriteUserId = params.userId;

        await csrf.validateCookies(cookies);
        await auth.validateApiSession(cookies, userCourseFavoriteUserId);

        if (!userCourseFavoriteCourseId) {
            throw new InvalidRequestError('Invalid course ID');
        }

        if (!userCourseFavoriteUserId) {
            throw new InvalidRequestError('Invalid user ID');
        }

        const result = await db
            .insertInto('UserCourseFavorite')
            .values({ userCourseFavoriteCourseId, userCourseFavoriteUserId })
            .ignore()
            .executeTakeFirstOrThrow();

        const created = Number(result.numInsertedOrUpdatedRows ?? 0) > 0;

        const responsePayload: UserCourseFavoritesCreateResponse = {
            count: 1,
            data: {
                created: created,
                message: created ? 'Course added to favorites' : 'Course already in favorites'
            },
            object: 'UserCourseFavorites',
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
