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

import type { Category } from '$lib/models/types/database.types';
import type { TestUtil } from '$lib/models/types/test-util';

import { RecordType } from '$lib/models/types/database.types';
import { cuid, db } from '$lib/server/database';

/* Constants */
interface CourseTestUtil extends TestUtil {
    getCategory(): Promise<Category>;
}

/* Module */
const module: CourseTestUtil = {
    // Required Clenup Method
    async cleanup(): Promise<number> {
        const result = await db
            .deleteFrom('Category')
            .where('Category.categoryRecordType', '=', 'TEST_RECORD')
            .executeTakeFirstOrThrow();
        return Number(result.numDeletedRows ?? 0);
    },

    // Additional Methods
    async getCategory(): Promise<Category> {
        const category = {
            categoryId: cuid(),
            categoryImgHref: '',
            categoryRecordType: RecordType.TEST_RECORD,
            categoryTitle: `unit-test-category-${cuid()}`
        };

        await db.insertInto('Category').values(category).execute();
        return category as unknown as Category;
    }
};

export default module;
