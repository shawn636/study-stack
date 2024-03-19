import { prisma } from '$lib/server/database';

import type { RequestHandler } from './$types';

export const GET = (async () => {
    const courseCategories = await prisma.category.findMany({
        include: {
            _count: {
                select: { courses: true }
            }
        },
        orderBy: {
            courses: {
                _count: 'desc'
            }
        },
        take: 6
    });

    const categoryNames = courseCategories.map((category) => category.title);
    const json = JSON.stringify(categoryNames);

    return new Response(json, {
        headers: {
            'access-control-allow-origin': '*', // CORS
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}) satisfies RequestHandler;
