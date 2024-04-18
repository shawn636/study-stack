import type { CourseSearchResult, CourseWithInstructor } from '$lib/models/types/api';

import {
    type CourseSortByOption,
    CourseSortByOptions
} from '$lib/models/types/course-sort-by-options';
import { db, sql } from '$lib/server/database';
import { error } from '@sveltejs/kit';

// CUSTOM ERROR CLASSES AND HANDLER

class HandledError extends Error {
    public statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'HandledError';
        this.statusCode = 500;
    }
}

class InvalidParameterError extends HandledError {
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

// SYNCHRONOUS HELPER FUNCTIONS
const parseSortByParam = (
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
const fetchCourseCount = async (searchTerm: String | null): Promise<number> => {
    try {
        let courseCountQuery = db
            .selectFrom('Course')
            .select(({ fn }) => [fn.count<number>('id').as('courseCount')]);

        if (searchTerm !== '' && searchTerm !== null && searchTerm !== undefined) {
            courseCountQuery = courseCountQuery.where(
                sql<boolean>`MATCH(title, description) AGAINST (${searchTerm} IN NATURAL LANGUAGE MODE)`
            );
        }
        const courseCountResult = await courseCountQuery.executeTakeFirstOrThrow();
        const courseCount = Number(courseCountResult.courseCount) ?? 0;

        return courseCount;
    } catch (e) {
        throw new DatabaseFetchError('Failed to fetch course count.');
    }
};

const fetchCourses = async (
    searchTerm: null | string,
    pageNo: number,
    pageSize: number,
    sortByValue: CourseSortByOption
): Promise<CourseWithInstructor[]> => {
    try {
        let courseResultQuery = db
            .selectFrom('Course')
            .innerJoin('User', 'Course.instructorId', 'User.id')
            .selectAll(['Course', 'User'])
            .select(
                sql<number>`MATCH(title, description) 
                    AGAINST (${searchTerm} IN NATURAL LANGUAGE MODE)
                    `.as('_relevance')
            );

        if (searchTerm !== '' && searchTerm !== null && searchTerm !== undefined) {
            courseResultQuery = courseResultQuery.where(
                sql<boolean>`MATCH(title, description) AGAINST (${searchTerm} IN NATURAL LANGUAGE MODE)`
            );
        }
        courseResultQuery = courseResultQuery
            .orderBy(sortByValue.dbField, sortByValue.dbOrderDirection)
            .limit(pageSize)
            .offset((pageNo - 1) * pageSize);

        const courseResults: (CourseWithInstructor & { _relevance: number })[] =
            await courseResultQuery.execute();

        const courses: CourseWithInstructor[] = courseResults.map(
            ({ _relevance, ...course }) => course
        );

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
