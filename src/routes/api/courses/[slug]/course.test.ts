import type { Course, User } from '$lib/models/types/database.types';

import { db } from '$lib/server/database';
/**
 * @vitest-environment jsdom
 */
describe('/api/courses', () => {
    it('should return a specific course', { timeout: 10000 }, async () => {
        const someCourseWithInstructor = await db
            .selectFrom('Course')
            .innerJoin('User', 'Course.courseInstructorId', 'User.userId')
            .selectAll(['Course', 'User'])
            .executeTakeFirstOrThrow();

        const response = await fetch(
            `http://localhost:3004/api/courses/${someCourseWithInstructor.courseId}`
        );
        expect(response.status).toBe(200);

        const result: Course & User = await response.json();

        expect(result.courseId).toBe(someCourseWithInstructor.courseId);
        expect(result.courseTitle).toBe(someCourseWithInstructor.courseTitle);
        expect(result.courseInstructorId).toBe(someCourseWithInstructor.courseInstructorId);
    });
});
