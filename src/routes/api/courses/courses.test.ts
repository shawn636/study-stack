import type Course from '$lib/models/course';

/**
 * @vitest-environment jsdom
 */
describe('/api/courses', () => {
    it('should return a list of courses', async () => {
        const response = await fetch('http://localhost:3004/api/courses', {
            method: 'GET'
        });

        expect(response.status).toBe(200);

        const courses: Course[] = await response.json();

        expect(courses.length).toBeGreaterThan(0);
    });
});
