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

import type { Course } from '$lib/models/types/database.types';
import type { TestUtil } from '$lib/models/types/test-util';

import { cuid, db } from '$lib/server/database';
import CategoryTestUtilModule from '$lib/server/test-utils/category';
import UserTestUtilModule from '$lib/server/test-utils/user';

/* Constants */

interface CourseTestUtil extends TestUtil {
    getCourse(): Promise<Course>;
    getCourses(count: number): Promise<Course[]>;
}

/* Module */
const module: CourseTestUtil = {
    // Required Clenup Method
    async cleanup() {
        const result = await db
            .deleteFrom('Course')
            .where('Course.courseTitle', 'like', 'unit-test-course-%')
            .executeTakeFirstOrThrow();

        if (result.numDeletedRows > 0) {
            console.log(`Cleaned up ${result.numDeletedRows} courses`);
        }
    },

    // Additional Methods
    async getCourse(): Promise<Course> {
        const [category, user] = await Promise.all([
            CategoryTestUtilModule.getCategory(),
            UserTestUtilModule.getUser()
        ]);

        const courseId = cuid();

        const course: Course = {
            categoryId: category.categoryId,
            courseCurrentPrice: 0,
            courseDescription: '',
            courseDifficulty: '',
            courseId: courseId,
            courseImgHref: '',
            courseOriginalPrice: 0,
            courseRatingAverage: 0,
            courseRatingCount: 0,
            courseTitle: `unit-test-course-${courseId}`,
            estimatedTimeHours: 0,
            estimatedTimeMinutes: 0,
            instructorId: user.userId,
            lessonCount: 0,
            organizationId: null
        };
        await db.insertInto('Course').values(course).execute();

        return course;
    },

    async getCourses(count: number): Promise<Course[]> {
        const [category, user] = await Promise.all([
            CategoryTestUtilModule.getCategory(),
            UserTestUtilModule.getUser()
        ]);

        const courses: Course[] = Array.from({ length: count }).map(() => {
            const courseId = cuid();
            const course: Course = {
                categoryId: category.categoryId,
                courseCurrentPrice: 0,
                courseDescription: '',
                courseDifficulty: '',
                courseId: courseId,
                courseImgHref: '',
                courseOriginalPrice: 0,
                courseRatingAverage: 0,
                courseRatingCount: 0,
                courseTitle: `unit-test-course-${courseId}`,
                estimatedTimeHours: 0,
                estimatedTimeMinutes: 0,
                instructorId: user.userId,
                lessonCount: 0,
                organizationId: null
            };
            return course;
        });

        await db.insertInto('Course').values(courses).execute();
        return courses;
    }
};

export default module;
