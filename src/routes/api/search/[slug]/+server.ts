import type { Course } from '$lib/models/types/database.types';

import { csrf } from '$lib/server/csrf';
import { db, sql } from '$lib/server/database';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

/**
 * Search API Endpoint (/api/search/[slug])
 *
 * Provides a search functionality for courses based on titles and descriptions.
 * It supports sorting of the search results based on various criteria, specified
 * through query parameters.
 *
 * @method GET
 *
 * @param {Object} cookies - The cookies object from the request. Used for CSRF validation.
 * @param {Object} params - The URL parameters object.
 *   - slug: String. The search term to query in the course database.
 * @param {URL} url - The URL object from the request. Used to extract query parameters.
 *   - sort_by (optional): String. Query parameter to specify the sorting criteria
 *     of the search results. Acceptable values are 'highest_rated', 'lowest_price',
 *     or 'relevance'. The format for this parameter in the request URL is
 *     `?sort_by=<param>`.
 *
 * If 'sort_by' is provided but is not one of the acceptable values, the request
 * is terminated with a 400 error indicating an invalid parameter.
 *
 * The endpoint first validates the CSRF token from the provided cookies.
 * The search results include a relevance score for sorting purposes.
 * Only the top 20 results are returned, sorted based on the specified criteria.
 *
 * @returns A JSON response containing a list of courses matching the search criteria,
 *          sorted as per the specified 'sort_by' parameter, or an error message for
 *          invalid requests.
 *
 * @example
 * // Typical JSON response
 * [
 *   {
 *     "id": 1,
 *     "title": "Advanced Programming Concepts",
 *     "description": "Deep dive into advanced topics...",
 *     // ...other Course fields
 *   },
 *   // ...more courses
 * ]
 *
 * Response headers include cache-control directives and content type.
 */
export const GET = (async ({ cookies, params, url }) => {
    await csrf.validateCookies(cookies);

    const searchParam = params.slug;

    const sortByParam = url.searchParams.get('sort_by') ?? 'relevance';

    if (!['highest_rated', 'lowest_price', 'relevance'].includes(sortByParam)) {
        error(400, 'Invalid sort_by parameter');
    }

    let orderByTerm: '_relevance' | 'currentPrice' | 'ratingAverage' = '_relevance';
    let orderByDirection: 'asc' | 'desc' = 'desc';

    switch (sortByParam) {
        case 'highest_rated':
            orderByTerm = 'ratingAverage';
            orderByDirection = 'desc';
            break;
        case 'lowest_price':
            orderByTerm = 'currentPrice';
            orderByDirection = 'asc';
            break;
        case 'relevance':
            orderByTerm = '_relevance';
            orderByDirection = 'desc';
            break;
    }

    const courseResultQuery = db.selectFrom('Course').selectAll();
    let courseResults: (Course & { _relevance: number })[] = [];

    if (searchParam) {
        courseResults = await courseResultQuery
            .select(
                sql<number>`MATCH(title, description) 
                AGAINST (${searchParam} IN NATURAL LANGUAGE MODE)
                `.as('_relevance')
            )
            .where(
                sql<boolean>`MATCH(title, description) AGAINST (${searchParam} IN NATURAL LANGUAGE MODE)`
            )
            .orderBy(orderByTerm, orderByDirection)
            .limit(20)
            .execute();
    } else {
        courseResults = await courseResultQuery
            .select(sql<number>`0`.as('_relevance'))
            .orderBy(orderByTerm, orderByDirection)
            .limit(20)
            .execute();
    }

    const courses = courseResults.map(({ _relevance, ...course }) => course);

    const json = JSON.stringify(courses);

    return new Response(json, {
        headers: {
            'cache-control': 'public, max-age=3600',
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}) satisfies RequestHandler;
