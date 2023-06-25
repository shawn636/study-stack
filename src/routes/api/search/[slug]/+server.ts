import type { RequestHandler } from './$types';
import { db } from '$lib/database';
import { error } from '@sveltejs/kit';
import type Course from '$lib/models/course';
import { csrf } from '$lib/server/csrf';

export const GET = (async ({ params, url, cookies }) => {
    const conn = db.connection();
    await csrf.validateCookies(cookies);

    const search_param = params.slug;

    const sort_by = url.searchParams.get('sort_by') ?? 'relevance';
    let expand_query = url.searchParams.get('expand_query') ?? 'false';

    if (!['relevance', 'highest_rated', 'lowest_price'].includes(sort_by)) {
        throw error(400, 'Invalid sort_by parameter');
    }

    try {
        expand_query = JSON.parse(expand_query);
    } catch (e) {
        throw error(400, 'Invalid expand_query parameter');
    }

    const search_query = `
        SELECT * FROM Course WHERE MATCH(title, description)
        AGAINST (? IN NATURAL LANGUAGE MODE ${expand_query ? 'WITH QUERY EXPANSION' : ''})
        ${
            sort_by === 'relevance'
                ? ''
                : `ORDER BY ${
                      sort_by === 'highest_rated' ? 'rating_avg DESC' : 'original_price ASC'
                  }`
        }`;

    const courses = await conn.execute(search_query, [search_param]);

    let json: string;
    if (courses.rows.length === 0) {
        json = JSON.stringify([] as Course[]);
    } else {
        json = JSON.stringify(courses.rows);
    }

    return new Response(json, {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'cache-control': 'public, max-age=3600'
        }
    });
}) satisfies RequestHandler;
