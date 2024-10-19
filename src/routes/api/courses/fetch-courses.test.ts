/**
 * @vitest-environment jsdom
 */

import type { ApiResponse } from '$lib/api/types/common';
import type { Course } from '$lib/models/types/database.types';
import type { CourseSearchResult } from '$lib/api/types/courses';
import type { HttpError } from '@sveltejs/kit';
import type { RecordDisplaySettings } from '$lib/models/types/record-display-settings';

import { fetchCourseCount, fetchCourses, getCourses, parseSortByParam } from './fetch-courses';

import { HIGHEST_RATING, LOWEST_PRICE, RELEVANCE } from '$lib/models/types/course-sort-by-options';
import CourseTestUtil from '$lib/server/test-utils/course';
import { cuid } from '$lib/server/database';
import { getRecordDisplaySettings } from '$lib/server/util';
import { InvalidParameterError } from '$lib/server/error-handling/handled-errors';

let options: RecordDisplaySettings | null;
let createdCourses: Course[] = [];
const premadeCourseCount = 5;

describe('Course Fetching Utility Functions', () => {
    beforeAll(async () => {
        options = await getRecordDisplaySettings();
        const newCourses = await CourseTestUtil.getCourses(premadeCourseCount);
        createdCourses = createdCourses.concat(newCourses);
    });
    afterAll(async () => {
        await CourseTestUtil.deleteCourses(createdCourses);
    });

    describe('parseSortByParam()', () => {
        it('should return the default sort by option when no sortByParam is provided', () => {
            const parsedParam = parseSortByParam(null, false);
            expect(parsedParam).toBe(HIGHEST_RATING);
        });
        it('should return a CourseSortByOption when a valid sortByParam is provided', () => {
            let param = RELEVANCE.param;
            let parsedParam = parseSortByParam(param, true);
            expect(parsedParam).toBe(RELEVANCE);

            param = LOWEST_PRICE.param;
            parsedParam = parseSortByParam(param, true);
            expect(parsedParam).toBe(LOWEST_PRICE);
        });
        it('should throw an InvalidParameterError when an invalid sortByParam is provided', () => {
            const invalidParam = 'invalidParam';
            expect(() => parseSortByParam(invalidParam, true)).toThrow(InvalidParameterError);
        });
    });

    describe('fetchCourseCount()', () => {
        it('should return 0 when no matching terms exist in the database', async () => {
            if (!options) throw new Error('RecordDisplaySettings not initialized');

            const randomCuid = cuid();
            const courseCount = await fetchCourseCount(randomCuid, options);
            expect(courseCount).toBe(0);
        });
        it('should return the number of matching terms in the database', async () => {
            if (!options) throw new Error('RecordDisplaySettings not initialized');
            const keyword = cuid().toString();
            const expectedCourseCount = 2;

            const newCourses = await CourseTestUtil.getCourses(expectedCourseCount, keyword);
            createdCourses = createdCourses.concat(newCourses);

            const courseCount = await fetchCourseCount(keyword, options);
            expect(courseCount).toBe(expectedCourseCount);
        });
        it('should return a non-zero courseCount when searchTerm is null', async () => {
            if (!options) throw new Error('RecordDisplaySettings not initialized');
            const courseCount = await fetchCourseCount(null, options);
            expect(courseCount).toBeGreaterThanOrEqual(premadeCourseCount);
        });
        it('should accept either an empty string or null as a searchTerm', async () => {
            if (!options) throw new Error('RecordDisplaySettings not initialized');

            const courseCountEmptyString = await fetchCourseCount('', options);
            const courseCountNull = await fetchCourseCount(null, options);
            expect(courseCountEmptyString).toBe(courseCountNull);
            expect(courseCountEmptyString).toBeGreaterThan(0);
        });
    });

    describe('fetchCourses()', () => {
        it('should return an empty array when no matching terms exist in the database', async () => {
            if (!options) throw new Error('RecordDisplaySettings not initialized');

            const randomSearchTerm = cuid().toString();
            const results = await fetchCourses(randomSearchTerm, 1, 10, RELEVANCE, options);
            expect(results).toBeInstanceOf(Array);
            expect(results).toHaveLength(0);
        });
        it('should return a properly sorted array of courses when matching terms exist in the database', async () => {
            if (!options) throw new Error('RecordDisplaySettings not initialized');

            const keyword = cuid().toString();
            const expectedCourseCount = 5;
            const newCourses = await CourseTestUtil.getCourses(expectedCourseCount, keyword);
            createdCourses = createdCourses.concat(newCourses);

            const [courseResultsByLowestPrice, courseResultsByHighestRating] = await Promise.all([
                fetchCourses(keyword, 0, 5, LOWEST_PRICE, options),
                fetchCourses(keyword, 0, 5, HIGHEST_RATING, options)
            ]);

            expect(courseResultsByLowestPrice).toBeInstanceOf(Array);
            expect(courseResultsByHighestRating).toBeInstanceOf(Array);

            expect(courseResultsByLowestPrice.length).toBe(courseResultsByHighestRating.length);
            expect(courseResultsByLowestPrice.length).toBeGreaterThan(0);

            const coursePrices = courseResultsByLowestPrice.map((result) =>
                Number(result.course.currentPrice)
            );
            const courseRatings = courseResultsByHighestRating.map(
                (result) => result.course.ratingAverage
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
            const response = await getCourses(null, 1, 20, RELEVANCE.param);
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
                expect(error.body.message).toBe('Invalid sort_by parameter: invalidSortBy');
            }
        });
        it('should have a courseCount less than or equal to the pageSize', async () => {
            const pageNo = 1;
            const pageSize = 20;
            const response = await getCourses(null, pageNo, pageSize, RELEVANCE.param);
            const data: unknown = await response?.json();
            const courseSearchResult = data as ApiResponse<CourseSearchResult>;

            expect(courseSearchResult?.data.courses.length).toBeLessThanOrEqual(pageSize);
        });
    });
});
