import type { RequestHandler } from './$types';
import { db } from '$lib/server/database';
import { csrf } from '$lib/server/csrf';

export const GET = (async ({ cookies }) => {
    const conn = db.connection();
    await csrf.validateCookies(cookies);

    const courses = await conn.execute(`SELECT * FROM Course LIMIT 20;`);

    const json = JSON.stringify(courses.rows);

    return new Response(json, {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'cache-control': 'public, max-age=3600'
        }
    });
}) satisfies RequestHandler;
