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

import { type Course, RecordType, type User } from '$lib/models/types/database.types';

import CourseTestUtilModule from '$lib/server/test-utils/course';
import { db } from '$lib/server/database';
import UserTestUtilModule from '$lib/server/test-utils/user';

/* Constants */
interface CourseFavoriteResult {
    courses: Course[];
    user: User;
}

interface CourseFavoriteResultWithCredentials extends CourseFavoriteResult {
    email: string;
    password: string;
}

interface CourseFavoritesTestUtil extends TestUtil {
    getCourseFavorites(count: number): Promise<CourseFavoriteResult>;
    getCourseFavoritesWithCredentials(count: number): Promise<CourseFavoriteResultWithCredentials>;
}

/* Module */
const module: CourseFavoritesTestUtil = {
    // Required Clenup Method
    async cleanup(): Promise<number> {
        const result = await db
            .deleteFrom('CourseFavorite')
            .where('CourseFavorite.recordType', '=', 'TEST_RECORD')
            .executeTakeFirstOrThrow();
        return Number(result.numDeletedRows ?? 0);
    },

    async getCourseFavorites(count: number): Promise<CourseFavoriteResult> {
        const { courses, user } = await this.getCourseFavoritesWithCredentials(count);

        return { courses, user };
    },

    // Additional Methods
    async getCourseFavoritesWithCredentials(
        count: number
    ): Promise<CourseFavoriteResultWithCredentials> {
        const { email, password, user } = await UserTestUtilModule.getUserWithCredentials();
        const courses = await CourseTestUtilModule.getCourses(count);

        const courseFavorites = courses.map((course) => {
            return {
                courseId: course.id,
                recordType: RecordType.TEST_RECORD,
                userId: user.id
            };
        });

        await db.insertInto('CourseFavorite').values(courseFavorites).execute();

        return { courses, email, password, user };
    }
};

export default module;
