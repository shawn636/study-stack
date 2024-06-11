import type { CreateFavoriteResponse } from '$lib/models/types/api';

import { db } from '$lib/server/database';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { getValidatedApiData } from './util';

export const POST = (async ({ cookies, url }) => {
    const { userCourseFavoriteCourseId, userCourseFavoriteUserId } = await getValidatedApiData(
        cookies,
        url
    );

    try {
        const result = await db
            .insertInto('UserCourseFavorite')
            .values({ userCourseFavoriteCourseId, userCourseFavoriteUserId })
            .ignore()
            .executeTakeFirstOrThrow();

        const created = Number(result.numInsertedOrUpdatedRows ?? 0) > 0;

        const responseData: CreateFavoriteResponse = {
            created: created,
            message: created ? 'Course added to favorites' : 'Course already in favorites'
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
