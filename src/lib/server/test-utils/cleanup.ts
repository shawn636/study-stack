import CategoryTestUtilModule from './category';
import CourseTestUtilModule from './course';
import UserTestUtilModule from './user';

// This is a list of all modules in test-utils which *must* have a cleanup method
// When adding a new test-utils module, import it and add it to this list
const modules = [UserTestUtilModule, CategoryTestUtilModule, CourseTestUtilModule];

export async function cleanup() {
    for (const module of modules) {
        await module.cleanup();
    }
}
