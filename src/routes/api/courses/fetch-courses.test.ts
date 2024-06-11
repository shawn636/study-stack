/**
 * @vitest-environment jsdom
 */

import type { ApiResponse } from '$lib/api/types/common';
// import type { CourseSearchResult } from '$lib/models/types/api';
import type { CourseSearchResult } from '$lib/api/types/courses';
import type { HttpError } from '@sveltejs/kit';

import { CourseSortByOptions } from '$lib/models/types/course-sort-by-options';
import { RecordType, UserRole } from '$lib/models/types/database.types';
import { cuid, db } from '$lib/server/database';

import {
    InvalidParameterError,
    fetchCourseCount,
    fetchCourses,
    getCourses,
    parseSortByParam
} from './fetch-courses';

// When declaring objects based on schema that includes Prisma enums,
// you can't include the type hint of the object if you're inserting
// those objects directly into the database. Thankfully, if you leave
// off a property by mistake, typescript will yell at you on the line
// where you're inserting the object into the database. A QOL workaround
// is to first declare the objects with the type hints, hit fill properties,
// and then remove the type hint. This way, you can ensure that you're
// not missing any properties.

const mockInstructor = {
    userAreaCode: null,
    userAuthUserId: null,
    userBio: null,
    userCity: null,
    userCountryCode: null,
    userEmail: 'instructor1@example.com',
    userId: cuid(),
    userName: 'Instructor 1',
    userOrganizationId: null,
    userPhoneNumber: null,
    userPhotoUrl: null,
    userRecordType: RecordType.TEST_RECORD,
    userRole: UserRole.USER,
    userState: null
};

const mockCategory = {
    categoryId: cuid(),
    categoryImgHref: '',
    categoryRecordType: RecordType.TEST_RECORD,
    categoryTitle: 'Test Category'
};

const cuidKeyword = cuid();

// 2 Courses out of the 3 contain the cuidKeyword in the title
const mockCourses = [
    {
        courseCategoryId: mockCategory.categoryId,
        courseCurrentPrice: 100,
        courseDescription: 'Test Course - Delete Me',
        courseDifficulty: 'medium',
        courseEstimatedTimeHours: 0,
        courseEstimatedTimeMinutes: 0,
        courseId: cuid(),
        courseImgHref: '',
        courseInstructorId: mockInstructor.userId,
        courseLessonCount: 0,
        courseOrganizationId: null,
        courseOriginalPrice: 100,
        courseRatingAverage: 5,
        courseRatingCount: 1,
        courseRecordType: RecordType.TEST_RECORD,
        courseTitle: `Test Course 1: ${cuidKeyword}`
    },
    {
        courseCategoryId: mockCategory.categoryId,
        courseCurrentPrice: 100,
        courseDescription: 'Test Course - Delete Me',
        courseDifficulty: 'medium',
        courseEstimatedTimeHours: 0,
        courseEstimatedTimeMinutes: 0,
        courseId: cuid(),
        courseImgHref: '',
        courseInstructorId: mockInstructor.userId,
        courseLessonCount: 0,
        courseOrganizationId: null,
        courseOriginalPrice: 100,
        courseRatingAverage: 5,
        courseRatingCount: 1,
        courseRecordType: RecordType.TEST_RECORD,
        courseTitle: `Test Course 2: ${cuidKeyword}`
    },
    {
        courseCategoryId: mockCategory.categoryId,
        courseCurrentPrice: 100,
        courseDescription: 'Test Course - Delete Me',
        courseDifficulty: 'medium',
        courseEstimatedTimeHours: 0,
        courseEstimatedTimeMinutes: 0,
        courseId: cuid(),
        courseImgHref: '',
        courseInstructorId: mockInstructor.userId,
        courseLessonCount: 0,
        courseOrganizationId: null,
        courseOriginalPrice: 100,
        courseRatingAverage: 5,
        courseRatingCount: 1,
        courseRecordType: RecordType.TEST_RECORD,
        courseTitle: 'Test Course 3'
    }
];

const createMockCourses = async (): Promise<void> => {
    // These must be done sequentially to avoid foreign key constraint errors
    await db.insertInto('Category').ignore().values(mockCategory).execute();
    await db.insertInto('User').ignore().values(mockInstructor).executeTakeFirst();
    await db.insertInto('Course').ignore().values(mockCourses).execute();
};

const deleteMockCourses = async (): Promise<void> => {
    await db
        .deleteFrom('Course')
        .where('Course.courseDescription', '=', 'Test Course - Delete Me')
        .execute();
    await db.deleteFrom('User').where('User.userId', '=', mockInstructor.userId).execute();
    await db
        .deleteFrom('Category')
        .where('Category.categoryId', '=', mockCategory.categoryId)
        .execute();
};

describe('Course Fetching Utility Functions', () => {
    beforeAll(async () => {
        await createMockCourses();
    });
    afterAll(async () => {
        await deleteMockCourses();
    });
    describe('parseSortByParam()', () => {
        it('should return the default sort by option when no sortByParam is provided', () => {
            const parsedParam = parseSortByParam(null, false);
            expect(parsedParam).toBe(CourseSortByOptions.HIGHEST_RATING);
        });

        it('should return a CourseSortByOption when a valid sortByParam is provided', () => {
            let param = CourseSortByOptions.RELEVANCE.param;
            let parsedParam = parseSortByParam(param, true);
            expect(parsedParam).toBe(CourseSortByOptions.RELEVANCE);

            param = CourseSortByOptions.LOWEST_PRICE.param;
            parsedParam = parseSortByParam(param, true);
            expect(parsedParam).toBe(CourseSortByOptions.LOWEST_PRICE);
        });
        it('should throw an InvalidParameterError when an invalid sortByParam is provided', () => {
            const invalidParam = 'invalidParam';
            expect(() => parseSortByParam(invalidParam, true)).toThrow(InvalidParameterError);
        });
    });
    describe('fetchCourseCount()', () => {
        it('should return 0 when no matching terms exist in the database', async () => {
            const randomCuid = cuid();
            const courseCount = await fetchCourseCount(randomCuid);
            expect(courseCount).toBe(0);
        });
        it('should return the number of matching terms in the database', async () => {
            const keywordFromTwoEntries = cuidKeyword;
            const predictedCourseCount = 2;

            const courseCount = await fetchCourseCount(keywordFromTwoEntries);
            expect(courseCount).toBe(predictedCourseCount);
        });
        it('should return a non-zero courseCount when searchTerm is null', async () => {
            const courseCount = await fetchCourseCount(null);
            expect(courseCount).toBeGreaterThan(0);
        });
        it('should accept either an empty string or null as a searchTerm', async () => {
            const courseCountEmptyString = await fetchCourseCount('');
            const courseCountNull = await fetchCourseCount(null);
            expect(courseCountEmptyString).toBe(courseCountNull);
            expect(courseCountEmptyString).toBeGreaterThan(0);
        });
    });
    describe('fetchCourses()', () => {
        it('should return an empty array when no matching terms exist in the database', async () => {
            const randomCuid = cuid();
            const results = await fetchCourses(randomCuid, 1, 10, CourseSortByOptions.RELEVANCE);
            expect(results).toBeInstanceOf(Array);
            expect(results).toHaveLength(0);
        });
        it('should return a properly sorted array of courses when matching terms exist in the database', async () => {
            const [courseResultsByLowestPrice, courseResultsByHighestRating] = await Promise.all([
                fetchCourses(cuidKeyword, 0, 5, CourseSortByOptions.LOWEST_PRICE),
                fetchCourses(cuidKeyword, 0, 5, CourseSortByOptions.HIGHEST_RATING)
            ]);

            expect(courseResultsByLowestPrice).toBeInstanceOf(Array);
            expect(courseResultsByHighestRating).toBeInstanceOf(Array);

            expect(courseResultsByLowestPrice.length).toBe(courseResultsByHighestRating.length);
            expect(courseResultsByLowestPrice.length).toBeGreaterThan(0);

            const coursePrices = courseResultsByLowestPrice.map((result) =>
                Number(result.course.courseCurrentPrice)
            );
            const courseRatings = courseResultsByHighestRating.map(
                (result) => result.course.courseRatingAverage
            );

            const courseCount = coursePrices.length;

            for (let i = 0; i < courseCount - 1; i++) {
                expect(coursePrices[i]).toBeLessThanOrEqual(coursePrices[i + 1]);
                expect(courseRatings[i]).toBeGreaterThanOrEqual(courseRatings[i + 1]);
            }
        });
    });
    describe('getCourses()', () => {
        it('should return a successful reponse when a valid request is made', async () => {
            const response = await getCourses(null, 1, 20, CourseSortByOptions.RELEVANCE.param);
            expect(response).toBeTruthy();
            expect(response?.ok).toBe(true);

            const data: unknown = await response?.json();
            const courseSearchResult = data as ApiResponse<CourseSearchResult>;
            expect(courseSearchResult).toBeTruthy();

            expect(courseSearchResult?.data.courses).toBeTruthy();
            expect(courseSearchResult?.data.totalCourses).toBeTruthy();

            expect(courseSearchResult?.data.courses.length).toBeGreaterThan(0);
            expect(courseSearchResult?.data.totalCourses).toBeGreaterThan(0);
        });
        it('should return a 400 error when an invalid request is made', async () => {
            const invalidSortBy = 'invalidSortBy';
            try {
                await getCourses(null, 1, 20, invalidSortBy);
            } catch (e) {
                const error = e as HttpError;

                expect(error).toBeTruthy();
                expect(error.status).toBe(400);
                expect(error.body.message).toContain('Invalid sort_by parameter');
            }
        });
        it('should have a courseCount less than or equal to the pageSize', async () => {
            const pageNo = 1;
            const pageSize = 20;
            const response = await getCourses(
                null,
                pageNo,
                pageSize,
                CourseSortByOptions.RELEVANCE.param
            );
            const data: unknown = await response?.json();
            const courseSearchResult = data as ApiResponse<CourseSearchResult>;
            expect(courseSearchResult?.data.courses.length).toBeLessThanOrEqual(pageSize);
        });
    });
});
