import { db } from '$lib/server/database';

import type { RequestHandler } from './$types';

export const GET = (async () => {
    const conn = db.connection();

    const topCategories = await conn.execute(`
        SELECT Category.title , COUNT(*) AS count, Category.img_href
        FROM Course JOIN Category on Course.categoryId = Category.id
        GROUP BY categoryId
        ORDER BY count DESC
        LIMIT 6;`);

    const json = JSON.stringify(topCategories.rows);

    return new Response(json, {
        headers: {
            'access-control-allow-origin': '*', // CORS
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}) satisfies RequestHandler;
