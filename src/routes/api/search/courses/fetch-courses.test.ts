/**
 * @vitest-environment jsdom
 */

import type { CourseSearchResult } from '$lib/models/types/api';
import type { Category, Course, User } from '$lib/models/types/database.types';
import type { HttpError } from '@sveltejs/kit';

import { CourseSortByOptions } from '$lib/models/types/course-sort-by-options';
import { cuid, db } from '$lib/server/database';

import {
    InvalidParameterError,
    fetchCourseCount,
    fetchCourses,
    getCourses,
    parseSortByParam
} from './fetch-courses';

const mockInstructor: User = {
    authUserId: null,
    organizationId: null,
    userAreaCode: null,
    userBio: null,
    userCity: null,
    userCountryCode: null,
    userEmail: 'instructor1@example.com',
    userId: cuid(),
    userName: 'Instructor 1',
    userPhoneNumber: null,
    userPhotoUrl: null,
    userRole: 'user',
    userState: null
};

const mockCategory: Category = {
    categoryId: cuid(),
    categoryImgHref: '',
    categoryTitle: 'Test Category'
};

const cuidKeyword = cuid();

// 2 Courses out of the 3 contain the cuidKeyword in the title
const mockCourses: Course[] = [
    {
        categoryId: mockCategory.categoryId,
        courseCurrentPrice: 100,
        courseDescription: 'Test Course - Delete Me',
        courseDifficulty: 'medium',
        courseId: cuid(),
        courseImgHref: '',
        courseOriginalPrice: 100,
        courseRatingAverage: 5,
        courseRatingCount: 1,
        courseTitle: `Test Course 1: ${cuidKeyword}`,
        estimatedTimeHours: 0,
        estimatedTimeMinutes: 0,
        instructorId: mockInstructor.userId,
        lessonCount: 0,
        organizationId: null
    },
    {
        categoryId: mockCategory.categoryId,
        courseCurrentPrice: 100,
        courseDescription: 'Test Course - Delete Me',
        courseDifficulty: 'medium',
        courseId: cuid(),
        courseImgHref: '',
        courseOriginalPrice: 100,
        courseRatingAverage: 5,
        courseRatingCount: 1,
        courseTitle: `Test Course 2: ${cuidKeyword}`,
        estimatedTimeHours: 0,
        estimatedTimeMinutes: 0,
        instructorId: mockInstructor.userId,
        lessonCount: 0,
        organizationId: null
    },
    {
        categoryId: mockCategory.categoryId,
        courseCurrentPrice: 100,
        courseDescription: 'Test Course - Delete Me',
        courseDifficulty: 'medium',
        courseId: cuid(),
        courseImgHref: '',
        courseOriginalPrice: 100,
        courseRatingAverage: 5,
        courseRatingCount: 1,
        courseTitle: 'Test Course 3',
        estimatedTimeHours: 0,
        estimatedTimeMinutes: 0,
        instructorId: mockInstructor.userId,
        lessonCount: 0,
        organizationId: null
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
            const courses = await fetchCourses(randomCuid, 1, 10, CourseSortByOptions.RELEVANCE);
            expect(courses).toBeInstanceOf(Array);
            expect(courses).toHaveLength(0);
        });
        it('should return a properly sorted array of courses when matching terms exist in the database', async () => {
            const [coursesByLowestPrice, coursesByHighestRating] = await Promise.all([
                fetchCourses(cuidKeyword, 0, 5, CourseSortByOptions.LOWEST_PRICE),
                fetchCourses(cuidKeyword, 0, 5, CourseSortByOptions.HIGHEST_RATING)
            ]);

            expect(coursesByLowestPrice).toBeInstanceOf(Array);
            expect(coursesByHighestRating).toBeInstanceOf(Array);

            expect(coursesByLowestPrice.length).toBe(coursesByHighestRating.length);
            expect(coursesByLowestPrice.length).toBeGreaterThan(0);

            const coursePrices = coursesByLowestPrice.map((course) =>
                Number(course.courseCurrentPrice)
            );
            const courseRatings = coursesByHighestRating.map(
                (course) => course.courseRatingAverage
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
            const courseSearchResult = data as CourseSearchResult;
            expect(courseSearchResult).toBeTruthy();
            expect(courseSearchResult.courses).toBeTruthy();
            expect(courseSearchResult?.courses).toBeTruthy();
            expect(courseSearchResult?.courseCount).toBeTruthy();

            expect(courseSearchResult?.courses.length).toBeGreaterThan(0);
            expect(courseSearchResult?.courseCount).toBeGreaterThan(0);
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
            const courseSearchResult = data as CourseSearchResult;

            expect(courseSearchResult?.courses.length).toBeLessThanOrEqual(pageSize);
        });
    });
});
