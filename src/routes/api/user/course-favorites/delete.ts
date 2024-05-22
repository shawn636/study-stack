import type { DeleteFavoriteResponse } from '$lib/models/types/api';

import { db } from '$lib/server/database';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { courseExists, getValidatedApiData } from './util';

export const DELETE = (async ({ cookies, url }) => {
    const { courseId, userId } = await getValidatedApiData(cookies, url);

    const courseDoesExist = await courseExists(courseId);

    if (!courseDoesExist) {
        error(404, 'Course not found');
    }

    try {
        const result = await db
            .deleteFrom('UserCourseFavorite')
            .where('UserCourseFavorite.courseId', '=', courseId)
            .where('UserCourseFavorite.userId', '=', userId)
            .executeTakeFirstOrThrow();

        const deleted = Number(result.numDeletedRows ?? 0) > 0;
        const responseData: DeleteFavoriteResponse = {
            deleted: deleted,
            message: deleted ? 'Course removed from favorites' : 'Course not in favorites'
        };

        return new Response(JSON.stringify(responseData), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200
        });
    } catch (e) {
        error(500, 'Error fetching favorites');
    }
}) satisfies RequestHandler;
