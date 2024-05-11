import { csrf } from '$lib/server/csrf';
import { db } from '$lib/server/database';

import type { RequestHandler } from './$types';

export const GET = (async ({ cookies, params }) => {
    await csrf.validateCookies(cookies);

    const slug = params.slug;

    if (!slug) {
        return new Response(null, { status: 400 });
    }

    try {
        const courseWithInstructor = await db
            .selectFrom('Course')
            .innerJoin('User', 'Course.instructorId', 'User.userId')
            .selectAll(['Course', 'User'])
            .where('Course.courseId', '=', slug)
            .executeTakeFirstOrThrow();

        const json = JSON.stringify(courseWithInstructor);
        return new Response(json, {
            headers: {
                'cache-control': 'public, max-age=3600',
                'content-type': 'application/json;charset=UTF-8'
            }
        });
    } catch (e) {
        console.log(e);
        return new Response(null, { status: 404 });
    }
}) satisfies RequestHandler;
