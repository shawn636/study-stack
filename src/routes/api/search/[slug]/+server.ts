import type { Course } from '@prisma/client';

import { csrf } from '$lib/server/csrf';
import { prisma } from '$lib/server/database';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET = (async ({ cookies, params, url }) => {
    await csrf.validateCookies(cookies);

    const searchParam = params.slug;

    const sortBy = url.searchParams.get('sort_by') ?? 'relevance';

    if (!['highest_rated', 'lowest_price', 'relevance'].includes(sortBy)) {
        error(400, 'Invalid sort_by parameter');
    }

    // Construct the OrderBy object based on the sort_by parameter
    const orderByRelevance = {
        _relevance: { fields: ['title'], search: searchParam, sort: 'asc' }
    };
    const orderByRating = { ratingAverage: 'desc' };
    const orderByPrice = { currentPrice: 'asc' };

    let orderBy = {};
    switch (sortBy) {
        case 'highest_rated':
            orderBy = orderByRating;
            break;
        case 'lowest_price':
            orderBy = orderByPrice;
            break;
        case 'relevance':
            orderBy = orderByRelevance;
            break;
    }

    let courses: Course[] = [];

    if (searchParam === '') {
        courses = await prisma.course.findMany({ orderBy, take: 20 });
    } else {
        courses = await prisma.course.findMany({
            orderBy,
            take: 20,
            where: { title: { search: searchParam } }
        });
    }

    const json = JSON.stringify(courses);

    return new Response(json, {
        headers: {
            'cache-control': 'public, max-age=3600',
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}) satisfies RequestHandler;
