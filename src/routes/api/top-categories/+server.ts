import type CategorySummary from '$lib/models/types/category-summary';

import { db } from '$lib/server/database';

import type { RequestHandler } from './$types';

/**
 * Top Categories API Endpoint (/api/top-categories)
 *
 * This endpoint retrieves a summary of the top categories based on the
 * number of courses available in each category. It is designed to provide
 * a quick overview of the most popular or frequently accessed categories.
 *
 * @method GET
 *
 * There are no query or URL parameters for this endpoint.
 *
 * The endpoint queries the database to count the number of courses in each category,
 * groups them by category, and then orders the results in descending order based on
 * the course count. It limits the response to the top 6 categories.
 *
 * Each category in the response includes the category image href, title, and the count
 * of courses in that category.
 *
 * @returns A JSON response containing an array of category summaries, each
 *          including the image href, title, and the count of courses.
 *          The response is sorted by the course count in descending order.
 *
 * @example
 * // Typical JSON response
 * [
 *   {
 *     "imgHref": "/images/category1.jpg",
 *     "title": "Programming",
 *     "count": 150
 *   },
 *   // ...more categories
 * ]
 *
 * Response headers include CORS settings and content type.
 */
export const GET = (async () => {
    const results = await db
        .selectFrom('Category')
        .innerJoin('Course', 'Category.categoryId', 'Course.categoryId')
        .select([
            'Category.categoryImgHref',
            'Category.categoryTitle',
            ({ fn }) => fn.countAll<number>().as('count')
        ])
        .groupBy(['Category.categoryImgHref', 'Category.categoryTitle'])
        .orderBy('count', 'desc')
        .limit(6)
        .execute();

    const categorySummaries = results as CategorySummary[];

    const json = JSON.stringify(categorySummaries);

    return new Response(json, {
        headers: {
            'access-control-allow-origin': '*', // CORS
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}) satisfies RequestHandler;
