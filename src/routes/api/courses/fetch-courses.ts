import type { RecordDisplaySettings } from '$lib/models/types/record-display-settings'; // import type { CourseSearchResult, CourseWithInstructor } from '$lib/models/types/api';

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
import { handleErrors } from '$lib/server/error-handling';
import { DatabaseError, InvalidParameterError } from '$lib/server/error-handling/handled-errors';
import { getRecordDisplaySettings } from '$lib/server/util';

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
export const fetchCourseCount = async (
    searchTerm: String | null,
    recordDisplaySettings: RecordDisplaySettings
): Promise<number> => {
    try {
        const courseCountResult = await db
            .selectFrom('Course')
            .select(({ fn }) => [fn.count<number>('courseId').as('courseCount')])
            .$if(searchTerm !== '' && searchTerm !== null && searchTerm !== undefined, (qb) =>
                qb.where(
                    sql<boolean>`MATCH(courseTitle, courseDescription) AGAINST (${searchTerm} IN NATURAL LANGUAGE MODE)`
                )
            )
            .$if(!recordDisplaySettings['display-test-records'], (qb) =>
                qb.where('courseRecordType', '!=', 'TEST_RECORD')
            )
            .$if(!recordDisplaySettings['display-seed-records'], (qb) =>
                qb.where('courseRecordType', '!=', 'SEED_RECORD')
            )
            .executeTakeFirstOrThrow();
        const courseCount = Number(courseCountResult.courseCount) ?? 0;

        return courseCount;
    } catch (e) {
        throw new DatabaseError('Failed to fetch course count.');
    }
};

export const fetchCourses = async (
    searchTerm: null | string,
    pageNo: number,
    pageSize: number,
    sortByValue: CourseSortByOption,
    recordDisplaySettings: RecordDisplaySettings,
    userId?: string
): Promise<CourseResult[]> => {
    try {
        const requestContainsSearchTerm =
            searchTerm !== '' && searchTerm !== null && searchTerm !== undefined;
        const sortByIsRelevance = sortByValue === CourseSortByOptions.RELEVANCE;

        const courseResultQuery = getFetchCoursesQuery(
            requestContainsSearchTerm,
            sortByIsRelevance,
            searchTerm,
            sortByValue,
            recordDisplaySettings,
            pageSize,
            pageNo,
            userId !== undefined && userId !== null,
            userId ?? ''
        );

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
                } else if (key === 'isFavorite') {
                    course[key] = Boolean(Number(value));
                }
            });

            return {
                course: course as { isFavorite?: boolean } & Course,
                instructor: instructor as User
            };
        });

        return courses;
    } catch (e) {
        throw new DatabaseError('Failed to fetch courses.');
    }
};

// Unforuntately, the logic for this method is very complex, and I was unable to find
// a way to move the logic that checks whether a userId is null into a .$if statement
// without causing the query to fail. It may be possible to refactor this method to
// make it more readable, but I was unable to do so in the time I had available.
const getFetchCoursesQuery = (
    requestContainsSearchTerm: boolean,
    sortByIsRelevance: boolean,
    searchTerm: null | string,
    sortByValue: CourseSortByOption,
    recordDisplaySettings: RecordDisplaySettings,
    pageSize: number,
    pageNo: number,
    includeFavorites: boolean = false,
    userId: string
) => {
    if (includeFavorites) {
        return db
            .selectFrom('Course')
            .innerJoin('User', 'Course.courseInstructorId', 'User.userId')
            .leftJoin('UserCourseFavorite', (join) =>
                join
                    .onRef('Course.courseId', '=', 'UserCourseFavorite.userCourseFavoriteCourseId')
                    .on('UserCourseFavorite.userCourseFavoriteUserId', '=', userId)
            )
            .selectAll(['Course', 'User'])
            .select(
                sql<boolean>`IF(UserCourseFavorite.userCourseFavoriteCourseId IS NOT NULL, TRUE, FALSE)`.as(
                    'isFavorite'
                )
            )
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
            .$if(!recordDisplaySettings['display-test-records'], (qb) =>
                qb.where('courseRecordType', '!=', 'TEST_RECORD')
            )
            .$if(!recordDisplaySettings['display-seed-records'], (qb) =>
                qb.where('courseRecordType', '!=', 'SEED_RECORD')
            )
            .limit(pageSize)
            .offset(pageNo * pageSize);
    } else {
        return db
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
            .$if(!recordDisplaySettings['display-test-records'], (qb) =>
                qb.where('courseRecordType', '!=', 'TEST_RECORD')
            )
            .$if(!recordDisplaySettings['display-seed-records'], (qb) =>
                qb.where('courseRecordType', '!=', 'SEED_RECORD')
            )
            .limit(pageSize)
            .offset(pageNo * pageSize);
    }
};

// PRIMARY HELPER FUNCTION
export const getCourses = async (
    searchTerm: null | string,
    pageNo: number,
    pageSize: number,
    sortByParam: string,
    userId?: string
) => {
    const requestContainsSearchTerm =
        searchTerm !== null && searchTerm !== undefined && searchTerm !== '';

    const options = await getRecordDisplaySettings();

    try {
        const sortByValue = parseSortByParam(sortByParam, requestContainsSearchTerm);
        const validatedSearchTerm = requestContainsSearchTerm ? searchTerm : null;

        const [courseCount, courses] = await Promise.all([
            fetchCourseCount(validatedSearchTerm, options),
            fetchCourses(validatedSearchTerm, pageNo, pageSize, sortByValue, options, userId)
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
        return handleErrors(e);
    }
};
