import { unitTestApiClient as client } from '$lib/server/test-utils/common';
import CourseTestUtilModule from '$lib/server/test-utils/course';
import { db } from '$lib/server/database';
/**
 * @vitest-environment jsdom
 */
describe('/api/courses', () => {
    beforeAll(async () => {
        // Ensures that there will be at least one course in the database
        await CourseTestUtilModule.getCourse();
    });
    it('should return a specific course', { timeout: 10000 }, async () => {
        const someCourseWithInstructor = await db
            .selectFrom('Course')
            .innerJoin('User', 'Course.instructorId', 'User.id')
            .selectAll(['Course', 'User'])
            .select(['Course.id as courseId', 'User.id as instructorId'])
            .where('Course.recordType', '=', 'TEST_RECORD')
            .executeTakeFirstOrThrow();

        const response = await client.courses.getCourse(someCourseWithInstructor.courseId);

        expect(response.success).toBe(true);

        expect(response.data.course.id).toBe(someCourseWithInstructor.courseId);
        expect(response.data.course.title).toBe(someCourseWithInstructor.title);
        expect(response.data.instructor.id).toBe(someCourseWithInstructor.instructorId);
    });
});
