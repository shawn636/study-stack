import type { Course, User } from '@prisma/client';

import { csrf } from '$lib/server/csrf';
import { prisma } from '$lib/server/database';

import type { RequestHandler } from './$types';

export const GET = (async ({ cookies }) => {
    await csrf.validateCookies(cookies);

    const coursesWithInstructors = await prisma.course.findMany({
        include: {
            instructor: true
        },
        take: 20
    });

    const unzippedCoursesWithInstructors: { course: Course; instructor: User }[] =
        coursesWithInstructors.map(({ instructor, ...course }) => ({
            course,
            instructor
        }));

    const json = JSON.stringify(unzippedCoursesWithInstructors);

    return new Response(json, {
        headers: {
            'cache-control': 'public, max-age=3600',
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}) satisfies RequestHandler;
