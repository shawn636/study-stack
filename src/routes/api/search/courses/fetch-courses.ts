import type { CourseSearchResult, CourseWithInstructor } from '$lib/models/types/api';

import {
    type CourseSortByOption,
    CourseSortByOptions
} from '$lib/models/types/course-sort-by-options';
import { db, sql } from '$lib/server/database';
import { error } from '@sveltejs/kit';

// CUSTOM ERROR CLASSES AND HANDLER

export class HandledError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'HandledError';
        this.statusCode = 500;
    }
}

export class InvalidParameterError extends HandledError {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'InvalidParameterError';
        this.statusCode = 400;
    }
}

class DatabaseFetchError extends HandledError {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'DatabaseFetchError';
        this.statusCode = 500;
    }
}

// ERROR HANDLER
const handleErrors = (e: unknown) => {
    if (e instanceof HandledError) {
        return error(e.statusCode, e.message);
    }

    return error(500, 'An unexpected error occurred.');
};

export const searchParamsAreValid = (
    urlSearchParams: URLSearchParams,
    requiredSearchParams: string[]
) => {
    let containsRequiredParams = true;
    if (!requiredSearchParams.every((param) => urlSearchParams.has(param))) {
        console.error('Missing required search params:', requiredSearchParams);
        containsRequiredParams = false;
    }

    const invalidSearchParams = Object.keys(urlSearchParams).filter(
        (key) => !requiredSearchParams.includes(key)
    );

    const containsInvalidParams = invalidSearchParams.length > 0;

    return containsRequiredParams && !containsInvalidParams;
};

// SYNCHRONOUS HELPER FUNCTIONS
export const parseSortByParam = (
    sortByParam: null | string,
    requestContainsSearchTerm: boolean
): CourseSortByOption => {
    if (!sortByParam) {
        const defaultSortBy = requestContainsSearchTerm
            ? CourseSortByOptions.RELEVANCE
            : CourseSortByOptions.HIGHEST_RATING;
        return defaultSortBy;
    }

    const parsedSortBy: CourseSortByOption | undefined = Object.values(CourseSortByOptions).find(
        (value: CourseSortByOption) => value.param === sortByParam
    );

    if (!parsedSortBy) {
        throw new InvalidParameterError(`Invalid sort_by parameter: ${sortByParam}`);
    }

    return parsedSortBy;
};

// ASYNCHRONOUS HELPER FUNCTIONS
export const fetchCourseCount = async (searchTerm: String | null): Promise<number> => {
    try {
        const courseCountResult = await db
            .selectFrom('Course')
            .select(({ fn }) => [fn.count<number>('id').as('courseCount')])
            .$if(searchTerm !== '' && searchTerm !== null && searchTerm !== undefined, (qb) =>
                qb.where(
                    sql<boolean>`MATCH(title, description) AGAINST (${searchTerm} IN NATURAL LANGUAGE MODE)`
                )
            )
            .executeTakeFirstOrThrow();
        const courseCount = Number(courseCountResult.courseCount) ?? 0;

        return courseCount;
    } catch (e) {
        throw new DatabaseFetchError('Failed to fetch course count.');
    }
};

export const fetchCourses = async (
    searchTerm: null | string,
    pageNo: number,
    pageSize: number,
    sortByValue: CourseSortByOption
): Promise<CourseWithInstructor[]> => {
    try {
        const requestContainsSearchTerm =
            searchTerm !== '' && searchTerm !== null && searchTerm !== undefined;
        const sortByIsRelevance = sortByValue === CourseSortByOptions.RELEVANCE;
        const courseResultQuery = db
            .selectFrom('Course')
            .innerJoin('User', 'Course.instructorId', 'User.id')
            .selectAll(['Course', 'User'])
            .$if(requestContainsSearchTerm, (qb) =>
                qb
                    .select(
                        sql<number>`MATCH(title) AGAINST (${searchTerm} IN NATURAL LANGUAGE MODE)`.as(
                            '_relevance'
                        )
                    )
                    .where(
                        sql<boolean>`MATCH(title) AGAINST (${searchTerm} IN NATURAL LANGUAGE MODE)`
                    )
            )
            .$if(requestContainsSearchTerm || !sortByIsRelevance, (qb) =>
                qb.orderBy(sortByValue.dbField, sortByValue.dbOrderDirection)
            )
            .limit(pageSize)
            .offset(pageNo * pageSize);

        const courseResults: (CourseWithInstructor & { _relevance?: number })[] =
            await courseResultQuery.execute();

        // Filter out the _relevance field if it exists
        const courses: CourseWithInstructor[] = courseResults.map((course) => {
            if (Object.keys(course).includes('_relevance')) {
                const { _relevance, ...rest } = course;
                return rest;
            } else {
                return course;
            }
        });

        return courses;
    } catch (e) {
        throw new DatabaseFetchError('Failed to fetch courses.');
    }
};

// PRIMARY HELPER FUNCTION
export const getCourses = async (
    searchTerm: null | string,
    pageNo: number,
    pageSize: number,
    sortByParam: string
) => {
    const requestContainsSearchTerm =
        searchTerm !== null && searchTerm !== undefined && searchTerm !== '';

    try {
        const sortByValue = parseSortByParam(sortByParam, requestContainsSearchTerm);
        const validatedSearchTerm = requestContainsSearchTerm ? searchTerm : null;

        const [courseCount, courses] = await Promise.all([
            fetchCourseCount(validatedSearchTerm),
            fetchCourses(validatedSearchTerm, pageNo, pageSize, sortByValue)
        ]);

        const result: CourseSearchResult = {
            courseCount: courseCount,
            courses: courses
        };

        const json = JSON.stringify(result);

        return new Response(json, {
            headers: {
                'cache-control': 'public, max-age=3600',
                'content-type': 'application/json;charset=UTF-8'
            }
        });
    } catch (e) {
        handleErrors(e);
    }
};
