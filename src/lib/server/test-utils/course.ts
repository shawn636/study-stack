/**
 * Test Utils Module
 *
 * This module is part of the test utilities suite. Each module in this folder
 * must implement the `TestUtil` interface and provide a `cleanup` method. The
 * `cleanup` method is used to remove all mockups from the database for this module.
 *
 * IMPORTANT:
 * 1. Ensure that this module implements the `TestUtil` interface.
 * 2. Add a `cleanup` method to this module that performs necessary cleanup operations.
 * 3. Import this module in `cleanup.ts` and add it to the const array of modules.
 *
 * Example:
 *
 * import { TestUtil } from './types';
 *
 * const moduleA: TestUtil = {
 *   async cleanup() {
 *     // Implementation for moduleA cleanup
 *   },
 *   // other moduleA specific functions
 * };
 *
 * export default moduleA;
 *
 * Don't forget to add:
 * import moduleA from './moduleA';
 * const modules = [otherModule1, otherModule2, ... moduleA]; <-- Add moduleA here
 *
 * to `cleanup.ts`.
 */

import type { TestUtil } from '$lib/models/types/test-util';

import { type Course, RecordType } from '$lib/models/types/database.types';
import { cuid, db } from '$lib/server/database';
import CategoryTestUtilModule from '$lib/server/test-utils/category';
import UserTestUtilModule from '$lib/server/test-utils/user';

/* Constants */

interface CourseTestUtil extends TestUtil {
    deleteCourses(courses: Course[]): Promise<number>;
    getCourse(titleKeyword?: string): Promise<Course>;
    getCourses(count: number, commonTitleKeyword?: string): Promise<Course[]>;
}

/* Module */
const module: CourseTestUtil = {
    // Required Clenup Method
    async cleanup(): Promise<number> {
        const result = await db
            .deleteFrom('Course')
            .where('Course.recordType', '=', RecordType.TEST_RECORD)
            .executeTakeFirstOrThrow();

        return Number(result.numDeletedRows ?? 0);
    },

    async deleteCourses(courses: Course[]): Promise<number> {
        const courseIds = courses.map((course) => course.id);
        const result = await db
            .deleteFrom('Course')
            .where('Course.id', 'in', courseIds)
            .executeTakeFirstOrThrow();

        return Number(result.numDeletedRows ?? 0);
    },

    // Additional Methods
    async getCourse(titleKeyword?: string): Promise<Course> {
        const [category, user] = await Promise.all([
            CategoryTestUtilModule.getCategory(),
            UserTestUtilModule.getUser()
        ]);

        const courseId = cuid();

        const title = titleKeyword
            ? `${titleKeyword} | Unit Test Course | ${courseId}`
            : `Unit Test Course | ${courseId}`;

        const course = {
            categoryId: category.id,
            currentPrice: 0,
            description: '',
            difficulty: '',
            estimatedTimeHours: 0,
            estimatedTimeMinutes: 0,
            id: courseId,
            imgHref: '',
            instructorId: user.id,
            lessonCount: 0,
            organizationId: null,
            originalPrice: 0,
            ratingAverage: 0,
            ratingCount: 0,
            recordType: RecordType.TEST_RECORD,
            title: title
        };
        await db.insertInto('Course').values(course).execute();

        return course as unknown as Course;
    },

    async getCourses(count: number, commonTitleKeyword?: string): Promise<Course[]> {
        const [category, user] = await Promise.all([
            CategoryTestUtilModule.getCategory(),
            UserTestUtilModule.getUser()
        ]);

        const courses = Array.from({ length: count }).map(() => {
            const courseId = cuid();

            const title = commonTitleKeyword
                ? `${commonTitleKeyword} | Unit Test Course | ${courseId}`
                : `Unit Test Course | ${courseId}`;

            const course = {
                categoryId: category.id,
                currentPrice: 0,
                description: '',
                difficulty: '',
                estimatedTimeHours: 0,
                estimatedTimeMinutes: 0,
                id: courseId,
                imgHref: '',
                instructorId: user.id,
                lessonCount: 0,
                organizationId: null,
                originalPrice: 0,
                ratingAverage: 0,
                ratingCount: 0,
                recordType: RecordType.TEST_RECORD,
                title: title
            };
            return course;
        });

        await db.insertInto('Course').values(courses).execute();
        return courses as unknown as Course[];
    }
};

export default module;
