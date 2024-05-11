import type { Course, User } from '$lib/models/types/database.types';

import { db } from '$lib/server/database';
/**
 * @vitest-environment jsdom
 */
describe('/api/courses', () => {
    it('should return a specific course', { timeout: 10000 }, async () => {
        const someCourseWithInstructor = await db
            .selectFrom('Course')
            .innerJoin('User', 'Course.instructorId', 'User.userId')
            .selectAll(['Course', 'User'])
            .executeTakeFirstOrThrow();

        // There appears to be a kysely bug that causes
        // the output of the above query to contain
        // only one id field which is (sometimes)
        // the id of the instructor, not the course.
        // Waiting for a workaround or fix.

        // If no fix is found, will have to rename
        // primary keys of all tables to avoid
        // this issue.

        const response = await fetch(
            `http://localhost:3004/api/courses/${someCourseWithInstructor.courseId}`
        );
        expect(response.status).toBe(200);

        const result: Course & User = await response.json();

        expect(result.courseId).toBe(someCourseWithInstructor.courseId);
        expect(result.courseTitle).toBe(someCourseWithInstructor.courseTitle);
        expect(result.instructorId).toBe(someCourseWithInstructor.instructorId);
    });
});
