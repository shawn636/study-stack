import type { RecordDisplaySettings } from '$lib/models/types/record-display-settings'; // import type { CourseSearchResult, CourseWithInstructor } from '$lib/models/types/api';

import type { Course, User } from '$lib/models/types/database.types';
import type {
    CourseResult,
    CourseSearchGetResponse,
    CourseSearchResult
} from '$lib/api/types/courses';
import { type Selectable } from 'kysely';

import {
    type CourseSortByOption,
    HIGHEST_RATING,
    LOWEST_PRICE,
    RELEVANCE
} from '$lib/models/types/course-sort-by-options';
import { DatabaseError, InvalidParameterError } from '$lib/server/error-handling/handled-errors';
import { db, sql } from '$lib/server/database';
import { getRecordDisplaySettings } from '$lib/server/util';
import { handleErrors } from '$lib/server/error-handling';

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
    sortByParam: string | null,
    requestContainsSearchTerm: boolean
): CourseSortByOption => {
    if (!sortByParam) {
        const defaultSortBy = requestContainsSearchTerm ? RELEVANCE : HIGHEST_RATING;
        return defaultSortBy;
    }

    let parsedSortBy: CourseSortByOption | undefined = undefined;

    switch (sortByParam) {
        case HIGHEST_RATING.param:
            parsedSortBy = HIGHEST_RATING;
            break;
        case LOWEST_PRICE.param:
            parsedSortBy = LOWEST_PRICE;
            break;
        case RELEVANCE.param:
            parsedSortBy = RELEVANCE;
            break;
        default:
            throw new InvalidParameterError(`Invalid sort_by parameter: ${sortByParam}`);
    }

    if (!parsedSortBy) {
        throw new InvalidParameterError(`Invalid sort_by parameter: ${sortByParam}`);
    }

    return parsedSortBy;
};

// ASYNCHRONOUS HELPER FUNCTIONS
export const fetchCourseCount = async (
    searchTerm: string | null,
    recordDisplaySettings: RecordDisplaySettings
): Promise<number> => {
    try {
        const courseCountResult = await db
            .selectFrom('Course')
            .select(({ fn }) => [fn.count<number>('id').as('courseCount')])
            .$if(searchTerm !== '' && searchTerm !== null && searchTerm !== undefined, (qb) =>
                qb.where(
                    sql<boolean>`MATCH(title, description) AGAINST (${searchTerm} IN NATURAL LANGUAGE MODE)`
                )
            )
            .$if(!recordDisplaySettings['display-test-records'], (qb) =>
                qb.where('Course.recordType', '!=', 'TEST_RECORD')
            )
            .$if(!recordDisplaySettings['display-seed-records'], (qb) =>
                qb.where('Course.recordType', '!=', 'SEED_RECORD')
            )
            .executeTakeFirstOrThrow();
        const courseCount = Number(courseCountResult.courseCount);

        return courseCount;
    } catch (e) {
        throw new DatabaseError('Failed to fetch course count.');
    }
};

export const fetchCourses = async (
    searchTerm: string | null,
    pageNo: number,
    pageSize: number,
    sortByValue: CourseSortByOption,
    recordDisplaySettings: RecordDisplaySettings,
    userId?: string
): Promise<CourseResult[]> => {
    try {
        const requestContainsSearchTerm =
            searchTerm !== '' && searchTerm !== null && searchTerm !== undefined;
        const sortByIsRelevance = sortByValue === RELEVANCE;

        const courseResultQuery = getCoursesForFetchCoursesQuery(
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

        const courses: (Selectable<Course> & { _relevance?: number; isFavorite?: boolean })[] =
            await courseResultQuery.execute();

        const instructorIds = courses.map((course) => course.instructorId);
        const instructors = await getAssociatedUsers(instructorIds);

        const courseResults: CourseResult[] = courses.map((course) => {
            const {
                _relevance: _courseRelevance,
                isFavorite: _courseIsFavorite,
                ...courseData
            } = course;

            const instructor:
                | (Selectable<User> & { _relevance?: number; isFavorite?: boolean })
                | undefined = instructors.find(
                (instructor) => instructor.id === course.instructorId
            );

            if (!instructor) {
                throw new DatabaseError('Failed to fetch course instructor.');
            }

            const {
                _relevance: _instructorRelevance,
                isFavorite: _instructorIsFavorite,
                ...instructorData
            } = instructor;

            return {
                course: {
                    ...courseData,
                    isFavorite: _courseIsFavorite
                },
                instructor: instructorData
            };
        });

        return courseResults;
    } catch (e) {
        throw new DatabaseError('Failed to fetch courses.');
    }
};

// Unforuntately, the logic for this method is very complex, and I was unable to find
// a way to move the logic that checks whether a userId is null into a .$if statement
// without causing the query to fail. It may be possible to refactor this method to
// make it more readable, but I was unable to do so in the time I had available.
const getCoursesForFetchCoursesQuery = (
    requestContainsSearchTerm: boolean,
    sortByIsRelevance: boolean,
    searchTerm: string | null,
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
            .innerJoin('User', 'Course.instructorId', 'User.id')
            .leftJoin('CourseFavorite', (join) =>
                join
                    .onRef('Course.id', '=', 'CourseFavorite.courseId')
                    .on('CourseFavorite.userId', '=', userId)
            )
            .selectAll('Course')
            .select(
                sql<boolean>`IF(CourseFavorite.courseId IS NOT NULL, TRUE, FALSE)`.as('isFavorite')
            )
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
            .$if(!recordDisplaySettings['display-test-records'], (qb) =>
                qb.where('Course.recordType', '!=', 'TEST_RECORD')
            )
            .$if(!recordDisplaySettings['display-seed-records'], (qb) =>
                qb.where('Course.recordType', '!=', 'SEED_RECORD')
            )
            .limit(pageSize)
            .offset(pageNo * pageSize);
    } else {
        return db
            .selectFrom('Course')
            .innerJoin('User', 'Course.instructorId', 'User.id')
            .selectAll('Course')
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
            .$if(!recordDisplaySettings['display-test-records'], (qb) =>
                qb.where('Course.recordType', '!=', 'TEST_RECORD')
            )
            .$if(!recordDisplaySettings['display-seed-records'], (qb) =>
                qb.where('Course.recordType', '!=', 'SEED_RECORD')
            )
            .limit(pageSize)
            .offset(pageNo * pageSize);
    }
};

const getAssociatedUsers = (userIds: string[]) => {
    if (userIds.length === 0) {
        return [] as Selectable<User>[];
    }
    return db.selectFrom('User').selectAll('User').where('User.id', 'in', userIds).execute();
};

// PRIMARY HELPER FUNCTION
export const getCourses = async (
    searchTerm: string | null,
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
