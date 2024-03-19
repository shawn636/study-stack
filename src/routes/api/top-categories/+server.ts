import type CategorySummary from '$lib/models/category-summary';

import { prisma } from '$lib/server/database';

import type { RequestHandler } from './$types';

export const GET = (async () => {
    const results = await prisma.category.findMany({
        orderBy: {
            courses: {
                _count: 'desc'
            }
        },
        select: {
            _count: {
                select: { courses: true }
            },
            imgHref: true,
            title: true
        },
        take: 6
    });

    const categorySummaries: CategorySummary[] = results.map((category) => ({
        count: category._count.courses,
        imgHref: category.imgHref,
        title: category.title
    }));

    const json = JSON.stringify(categorySummaries);

    return new Response(json, {
        headers: {
            'access-control-allow-origin': '*', // CORS
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}) satisfies RequestHandler;
