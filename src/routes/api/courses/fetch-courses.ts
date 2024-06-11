// import type { CourseSearchResult, CourseWithInstructor } from '$lib/models/types/api';

import type {
    CourseResult,
    CourseSearchGetResponse,
    CourseSearchResult
} from '$lib/api/types/courses';
import type { Course, User } from '$lib/models/types/database.types';

import {
    type CourseSortByOption,
    CourseSortByOptions
} from '$lib/models/types/course-sort-by-options';
import { db, sql } from '$lib/server/database';
import { HandledError, handleErrors } from '$lib/server/util';

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
            .select(({ fn }) => [fn.count<number>('courseId').as('courseCount')])
            .$if(searchTerm !== '' && searchTerm !== null && searchTerm !== undefined, (qb) =>
                qb.where(
                    sql<boolean>`MATCH(courseTitle, courseDescription) AGAINST (${searchTerm} IN NATURAL LANGUAGE MODE)`
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
): Promise<CourseResult[]> => {
    try {
        const requestContainsSearchTerm =
            searchTerm !== '' && searchTerm !== null && searchTerm !== undefined;
        const sortByIsRelevance = sortByValue === CourseSortByOptions.RELEVANCE;
        const courseResultQuery = db
            .selectFrom('Course')
            .innerJoin('User', 'Course.courseInstructorId', 'User.userId')
            .selectAll(['Course', 'User'])
            .$if(requestContainsSearchTerm, (qb) =>
                qb
                    .select(
                        sql<number>`MATCH(courseTitle) AGAINST (${searchTerm} IN NATURAL LANGUAGE MODE)`.as(
                            '_relevance'
                        )
                    )
                    .where(
                        sql<boolean>`MATCH(courseTitle) AGAINST (${searchTerm} IN NATURAL LANGUAGE MODE)`
                    )
            )
            .$if(requestContainsSearchTerm || !sortByIsRelevance, (qb) =>
                qb.orderBy(sortByValue.dbField, sortByValue.dbOrderDirection)
            )
            .limit(pageSize)
            .offset(pageNo * pageSize);

        const courseResults = await courseResultQuery.execute();

        const courses: CourseResult[] = courseResults.map((dbResultRow) => {
            // We are using `any` here to dynamically assign values to `course` and `instructor`.
            // TypeScript does not allow dynamic keys without an index signature, and adding
            // such a signature would undermine type safety across the codebase.
            // Since in the kysely query we are using selectAll(['Course', 'User']), we know that
            // the result will contain all fields of `Course` and `User`. We are also using the
            // `CourseResult` type to ensure that the keys are correct. Therefore, we can safely
            // cast the result to `Course` and `User` types. This is a trade-off between type safety
            // and code readability/dynamism. We are opting for the latter in this case.

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const course: any = {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const instructor: any = {};

            Object.entries(dbResultRow).forEach(([key, value]) => {
                if (key.startsWith('course')) {
                    course[key] = value;
                } else if (key.startsWith('user')) {
                    instructor[key] = value;
                }
            });

            return { course: course as Course, instructor: instructor as User };
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

        const data: CourseSearchResult = {
            courses: courses,
            totalCourses: courseCount
        };

        const result: CourseSearchGetResponse = {
            count: courses.length,
            data: data,
            object: 'Course',
            success: true
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
