import type { CourseFavoritesDeleteResponse } from '$lib/api/types/users';
import type { DeleteResult } from 'kysely';

import { DatabaseError, NotFoundError } from '$lib/server/error-handling/handled-errors';

import { auth } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { handleErrors } from '$lib/server/error-handling';

import type { RequestHandler } from './$types';

export const DELETE = (async ({ cookies, params }) => {
    try {
        const courseId = params.courseId;
        const userId = params.userId;

        await auth.validateApiSession(cookies, userId);

        try {
            const course = await db
                .selectFrom('Course')
                .select('Course.id')
                .where('Course.id', '=', courseId)
                .executeTakeFirstOrThrow();

            if (!course || !course.id) {
                throw new NotFoundError('Course not found');
            }
        } catch (e) {
            throw new NotFoundError('Course not found');
        }

        let result: DeleteResult;
        try {
            result = await db
                .deleteFrom('CourseFavorite')
                .where('CourseFavorite.courseId', '=', courseId)
                .where('CourseFavorite.userId', '=', userId)
                .executeTakeFirstOrThrow();
        } catch (e) {
            throw new DatabaseError(`Error fetching favorites: ${e}`);
        }

        const deleted = Number(result?.numDeletedRows ?? 0) > 0;

        const responsePayload: CourseFavoritesDeleteResponse = {
            count: 1,
            data: {
                deleted: deleted,
                message: deleted ? 'Course removed from favorites' : 'Course not in favorites'
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
