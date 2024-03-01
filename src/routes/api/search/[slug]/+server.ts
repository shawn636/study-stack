import type Course from '$lib/models/course';

import { csrf } from '$lib/server/csrf';
import { db } from '$lib/server/database';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET = (async ({ cookies, params, url }) => {
    const conn = db.connection();
    await csrf.validateCookies(cookies);

    const searchParam = params.slug;

    const sortBy = url.searchParams.get('sort_by') ?? 'relevance';
    let expandQuery = url.searchParams.get('expand_query') ?? 'false';

    if (!['highest_rated', 'lowest_price', 'relevance'].includes(sortBy)) {
        error(400, 'Invalid sort_by parameter');
    }

    try {
        expandQuery = JSON.parse(expandQuery);
    } catch (e) {
        error(400, 'Invalid expand_query parameter');
    }

    const searchQuery = `
        SELECT * FROM Course WHERE MATCH(title, description)
        AGAINST (? IN NATURAL LANGUAGE MODE ${expandQuery ? 'WITH QUERY EXPANSION' : ''})
        ${
            sortBy === 'relevance'
                ? ''
                : `ORDER BY ${
                      sortBy === 'highest_rated' ? 'rating_avg DESC' : 'original_price ASC'
                  }`
        }`;

    const courses = await conn.execute(searchQuery, [searchParam]);

    let json: string;
    if (courses.rows.length === 0) {
        json = JSON.stringify([] as Course[]);
    } else {
        json = JSON.stringify(courses.rows);
    }

    return new Response(json, {
        headers: {
            'cache-control': 'public, max-age=3600',
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}) satisfies RequestHandler;
