// import type { DeleteFavoriteResponse } from '$lib/models/types/api';
import type { DeleteResult } from 'kysely';
import type { UserCourseFavoritesDeleteResponse } from '$lib/api/types/users';

import { DatabaseError, NotFoundError } from '$lib/server/error-handling/handled-errors';

import { auth } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { handleErrors } from '$lib/server/error-handling';

import type { RequestHandler } from './$types';

export const DELETE = (async ({ cookies, params }) => {
    try {
        const userCourseFavoriteCourseId = params.courseId;
        const userCourseFavoriteUserId = params.userId;

        await auth.validateApiSession(cookies, userCourseFavoriteUserId);

        try {
            const course = await db
                .selectFrom('Course')
                .select('Course.courseId')
                .where('Course.courseId', '=', userCourseFavoriteCourseId)
                .executeTakeFirstOrThrow();

            if (!course || !course.courseId) {
                throw new NotFoundError('Course not found');
            }
        } catch (e) {
            throw new NotFoundError('Course not found');
        }

        let result: DeleteResult;
        try {
            result = await db
                .deleteFrom('UserCourseFavorite')
                .where(
                    'UserCourseFavorite.userCourseFavoriteCourseId',
                    '=',
                    userCourseFavoriteCourseId
                )
                .where('UserCourseFavorite.userCourseFavoriteUserId', '=', userCourseFavoriteUserId)
                .executeTakeFirstOrThrow();
        } catch (e) {
            throw new DatabaseError(`Error fetching favorites: ${e}`);
        }

        const deleted = Number(result?.numDeletedRows ?? 0) > 0;

        const responsePayload: UserCourseFavoritesDeleteResponse = {
            count: 1,
            data: {
                deleted: deleted,
                message: deleted ? 'Course removed from favorites' : 'Course not in favorites'
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
