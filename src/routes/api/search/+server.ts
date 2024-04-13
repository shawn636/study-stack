import type { Course } from '$lib/models/types/database.types';

import { SortBy, type SortByValue } from '$lib/models/types/sort-by';
import { csrf } from '$lib/server/csrf';
import { db, sql } from '$lib/server/database';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET = (async ({ cookies, url }) => {
    await csrf.validateCookies(cookies);

    let sortByValue: SortByValue = SortBy.RELEVANCE;

    if (url.searchParams.get('sort_by') !== null) {
        const sortByParam: string = url.searchParams.get('sort_by') ?? '';
        if (
            !Object.values(SortBy)
                .map((value) => value.param)
                .includes(sortByParam)
        ) {
            return error(400, `Invalid sort_by parameter: ${sortByParam}`);
        }

        sortByValue = Object.values(SortBy).find(
            (value: SortByValue) => value.param === sortByParam
        );
    }

    const courseResultQuery = db.selectFrom('Course').selectAll();
    let courseResults: (Course & { _relevance: number })[] = [];

    courseResults = await courseResultQuery
        .select(sql<number>`0`.as('_relevance'))
        .orderBy(sortByValue.dbField, sortByValue.dbOrderDirection)
        .limit(20)
        .execute();

    const courses = courseResults.map(({ _relevance, ...course }) => course);

    const json = JSON.stringify(courses);

    return new Response(json, {
        headers: {
            'cache-control': 'public, max-age=3600',
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}) satisfies RequestHandler;
