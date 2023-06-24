import type { RequestHandler } from './$types';
import { db } from '$lib/database';
import { csrf } from '$lib/server/csrf';

export const GET = (async ({ params }) => {
    const conn = db.connection();
    // await csrf.validateCookies(cookies);

    const search_query = params.slug;

    console.log(search_query);

    const topCategories = await conn.execute(`
        SELECT Category.title , COUNT(*) AS count, Category.img_href
        FROM Course JOIN Category on Course.categoryId = Category.id
        GROUP BY categoryId
        ORDER BY count DESC
        LIMIT 6;`);

    const json = JSON.stringify(topCategories.rows);

    return new Response(json, {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'access-control-allow-origin': '*' // CORS
        }
    });
}) satisfies RequestHandler;
