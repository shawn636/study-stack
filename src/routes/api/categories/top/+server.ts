import type CategorySummary from '$lib/models/types/category-summary';
import type { TopCategoriesGetResponse } from '$lib/api/types/categories';

import { DatabaseError } from '$lib/server/error-handling/handled-errors';
import { db } from '$lib/server/database';
import { getRecordDisplaySettings } from '$lib/server/util';
import { handleErrors } from '$lib/server/error-handling';

import type { RequestHandler } from './$types';

/**
 * Top Categories API Endpoint (/api/categories/top)
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
    try {
        const siteSettings = await getRecordDisplaySettings();

        let results: CategorySummary[] = [];
        try {
            results = await db
                .selectFrom('Category')
                .innerJoin('Course', 'Category.categoryId', 'Course.courseCategoryId')
                .select([
                    'Category.categoryImgHref',
                    'Category.categoryTitle',
                    ({ fn }) => fn.countAll<number>().as('count')
                ])
                .$if(!siteSettings['display-test-records'], (qb) =>
                    qb.where('Category.categoryRecordType', '!=', 'TEST_RECORD')
                )
                .$if(!siteSettings['display-seed-records'], (qb) =>
                    qb.where('Category.categoryRecordType', '!=', 'SEED_RECORD')
                )
                .groupBy(['Category.categoryImgHref', 'Category.categoryTitle'])
                .orderBy('count', 'desc')
                .limit(6)
                .execute();
        } catch (e) {
            throw new DatabaseError(`Unable to retrieve top categories: ${e}`);
        }

        const categorySummaries = results as CategorySummary[];

        const result: TopCategoriesGetResponse = {
            count: categorySummaries.length,
            data: categorySummaries,
            object: 'CategorySummaryList',
            success: true
        };

        const json = JSON.stringify(result);

        return new Response(json, {
            headers: {
                'content-type': 'application/json;charset=UTF-8'
            }
        });
    } catch (e) {
        return handleErrors(e);
    }
}) satisfies RequestHandler;
