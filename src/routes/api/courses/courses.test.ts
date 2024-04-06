import type { Course, User } from '$lib/models/types/database.types';
/**
 * @vitest-environment jsdom
 */
describe('/api/courses', () => {
    it(
        'should return a list of courses',
        async () => {
            const response = await fetch('http://localhost:3004/api/courses', {
                method: 'GET'
            });

            expect(response.status).toBe(200);

            const courses: (Course & User)[] = await response.json();
            expect(courses.length).toBeGreaterThan(0);
        },
        {
            timeout: 10000
        }
    );
});
