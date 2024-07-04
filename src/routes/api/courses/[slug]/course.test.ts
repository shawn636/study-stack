import { db } from '$lib/server/database';
import { unitTestApiClient as client } from '$lib/server/test-utils/common';
import CourseTestUtilModule from '$lib/server/test-utils/course';
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
            .innerJoin('User', 'Course.courseInstructorId', 'User.userId')
            .selectAll(['Course', 'User'])
            .where('Course.courseRecordType', '=', 'TEST_RECORD')
            .executeTakeFirstOrThrow();

        const response = await client.courses.getCourse(someCourseWithInstructor.courseId);

        expect(response.success).toBe(true);

        expect(response.data.course.courseId).toBe(someCourseWithInstructor.courseId);
        expect(response.data.course.courseTitle).toBe(someCourseWithInstructor.courseTitle);
        expect(response.data.instructor.userId).toBe(someCourseWithInstructor.courseInstructorId);
    });
});
