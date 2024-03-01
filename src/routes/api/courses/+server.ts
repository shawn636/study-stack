import { csrf } from '$lib/server/csrf';
import { db } from '$lib/server/database';

import type { RequestHandler } from './$types';

export const GET = (async ({ cookies }) => {
    const conn = db.connection();
    await csrf.validateCookies(cookies);

    const courses = await conn.execute('SELECT * FROM Course LIMIT 20;');

    const json = JSON.stringify(courses.rows);

    return new Response(json, {
        headers: {
            'cache-control': 'public, max-age=3600',
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}) satisfies RequestHandler;
