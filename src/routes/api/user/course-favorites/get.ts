/**
 * @description
 * GET /api/favorites
 *
 * This API endpoint retrieves the favorite course IDs for a user. The user is identified based on the cookies and URL parameters provided in the request. If the user has no favorite courses, an empty array is returned.
 *
 * @param {Object} request - The request object.
 * @param {Object} request.cookies - Cookies for user authentication.
 * @param {Object} request.url - URL object that may include parameters required for user validation.
 *
 * @returns {Response}
 * - 200 OK: Returns a JSON array of course IDs if the user has favorite courses, or an empty array if there are no favorites.
 * - 500 Internal Server Error: Returns an error message if there is an issue fetching the favorites or an unexpected error occurs.
 *
 * @throws {Error}
 * - Throws a 500 error if fetching favorites from the database fails or if any unexpected error occurs.
 */

import { db } from '$lib/server/database';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

import { getValidatedApiData } from './util';

export const GET = (async ({ cookies, url }) => {
    const courseIdRequired = false;
    const { userCourseFavoriteUserId } = await getValidatedApiData(cookies, url, courseIdRequired);

    try {
        const favorites = await db
            .selectFrom('UserCourseFavorite')
            .select('UserCourseFavorite.userCourseFavoriteCourseId')
            .where('UserCourseFavorite.userCourseFavoriteUserId', '=', userCourseFavoriteUserId)
            .execute();

        let favoriteIds = favorites.map(
            (favorite: { userCourseFavoriteCourseId: string }) =>
                favorite.userCourseFavoriteCourseId
        );

        if (favoriteIds.length === 0) {
            favoriteIds = [];
        }
        const json = JSON.stringify(favoriteIds);

        return new Response(json, {
            status: 200
        });
    } catch (e) {
        console.error(`Error fetching favorites: ${e}`);
        error(500, 'Error fetching favorites');
    }
}) satisfies RequestHandler;
