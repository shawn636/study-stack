import type { TestUtil } from '$lib/models/types/test-util';

import CategoryTestUtilModule from './category';
import CourseFavoritesTestUtilModule from './course-favorites';
import CourseTestUtilModule from './course';
import UserTestUtilModule from './user';

type ModuleRecord = {
    module: TestUtil;
    table: string;
};

// This is a list of all modules in test-utils which *must* have a cleanup method
// When adding a new test-utils module, import it and add it to this list
// NOTE: ORDER MATTERS! Modules must be cleaned up in the correct order to avoid foreign key constraints
const moduleRecords: ModuleRecord[] = [
    { module: CourseFavoritesTestUtilModule, table: 'CourseFavorites' },
    { module: UserTestUtilModule, table: 'User' },
    { module: CourseTestUtilModule, table: 'Course' },
    { module: CategoryTestUtilModule, table: 'Category' }
];

export async function cleanup() {
    // Create dict to store count of records deleted per module and initialize to 0
    const deletedCounts = Object.fromEntries(moduleRecords.map((record) => [record.table, 0]));

    // Must be done synchronously because of foreign key constraints
    for (const record of moduleRecords) {
        deletedCounts[record.table] = await record.module.cleanup();
    }

    return deletedCounts;
}
