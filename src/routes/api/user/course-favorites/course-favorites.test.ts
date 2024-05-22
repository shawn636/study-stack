import type { DeleteFavoriteResponse } from '$lib/models/types/api';
import type { CreateFavoriteResponse } from '$lib/models/types/api';

import { COOKIE_NAME, auth } from '$lib/server/auth';
import { UNIT_TEST_URL_BASE } from '$lib/server/test-utils/common';
import CourseTestUtilModule from '$lib/server/test-utils/course';
import CourseFavoritesTestUtilModule from '$lib/server/test-utils/course-favorites';
import UserTestUtilModule from '$lib/server/test-utils/user';

/**
 * @vitest-environment jsdom
 */

describe('GET /api/favorites', () => {
    it('should return a 200 status and an empty array when the user has no favorite courses', async () => {
        const { email, password } = await UserTestUtilModule.getUserWithCredentials();
        const sessionId = await auth.login(email, password);
        const response = await fetch(`${UNIT_TEST_URL_BASE}/api/user/course-favorites`, {
            headers: {
                'Content-Type': 'application/json',
                cookie: `${COOKIE_NAME}=${sessionId}`
            }
        });

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual([]);
    });

    it('should return a 200 status and an array of favorite course IDs when the user has favorite courses', async () => {
        const { courses, email, password } =
            await CourseFavoritesTestUtilModule.getCourseFavoritesWithCredentials(3);
        const sessionId = await auth.login(email, password);

        const response = await fetch(`${UNIT_TEST_URL_BASE}/api/user/course-favorites`, {
            headers: {
                'Content-Type': 'application/json',
                cookie: `${COOKIE_NAME}=${sessionId}`
            }
        });

        expect(response.status).toBe(200);
        const data = await response.json();

        expect(data.sort()).toEqual(courses.map((course) => course.courseId).sort());
    });

    it('should return a 401 status and an error message if the user is not signed in', async () => {
        const response = await fetch(`${UNIT_TEST_URL_BASE}/api/user/course-favorites`);
        expect(response.status).toBe(401);
    });
});

describe('DELETE /api/favorites/:id', () => {
    it('should return a 200 status when a course is successfully deleted', async () => {
        const { courses, email, password } =
            await CourseFavoritesTestUtilModule.getCourseFavoritesWithCredentials(3);

        const sessionId = await auth.login(email, password);

        const response = await fetch(
            `${UNIT_TEST_URL_BASE}/api/user/course-favorites/?course_id=${courses[0].courseId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    cookie: `${COOKIE_NAME}=${sessionId}`
                },
                method: 'DELETE'
            }
        );

        expect(response.status).toBe(200);

        const deleteFavoriteResponse: DeleteFavoriteResponse = await response.json();
        expect(deleteFavoriteResponse.deleted).toBe(true);

        const favoritesResponse = await fetch(`${UNIT_TEST_URL_BASE}/api/user/course-favorites`, {
            headers: {
                'Content-Type': 'application/json',
                cookie: `${COOKIE_NAME}=${sessionId}`
            }
        });

        expect(favoritesResponse.status).toBe(200);
        const data = await favoritesResponse.json();
        expect(data.sort()).toEqual(
            courses
                .slice(1)
                .map((course) => course.courseId)
                .sort()
        );
    });

    it('should return a 200 response with { courseFound: false } when the course exists but is not favorited by the user', async () => {
        const { email, password } = await UserTestUtilModule.getUserWithCredentials();
        const sessionId = await auth.login(email, password);

        const nonFavoritedCourse = await CourseTestUtilModule.getCourse();
        const response = await fetch(
            `${UNIT_TEST_URL_BASE}/api/user/course-favorites/?course_id=${nonFavoritedCourse.courseId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    cookie: `${COOKIE_NAME}=${sessionId}`
                },
                method: 'DELETE'
            }
        );

        const data: DeleteFavoriteResponse = await response.json();
        expect(response.status).toBe(200);
        expect(data.deleted).toBe(false);
    });

    it('should return a 404 response if the course does not exist', async () => {
        const { email, password } = await UserTestUtilModule.getUserWithCredentials();
        const sessionId = await auth.login(email, password);

        const nonExistentCourseId = 'non-existent-course-id';
        const response = await fetch(
            `${UNIT_TEST_URL_BASE}/api/user/course-favorites/?course_id=${nonExistentCourseId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    cookie: `${COOKIE_NAME}=${sessionId}`
                },
                method: 'DELETE'
            }
        );
        expect(response.status).toBe(404);
    });
});

describe('POST /api/favorites', () => {
    it('should return a 200 status when a favorite course is successfully added', async () => {
        const { email, password } = await UserTestUtilModule.getUserWithCredentials();
        const sessionId = await auth.login(email, password);
        const course = await CourseTestUtilModule.getCourse();

        const response = await fetch(
            `${UNIT_TEST_URL_BASE}/api/user/course-favorites?course_id=${course.courseId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    cookie: `${COOKIE_NAME}=${sessionId}`
                },
                method: 'POST'
            }
        );

        expect(response.status).toBe(200);

        const createFavoriteResponse: CreateFavoriteResponse = await response.json();
        expect(createFavoriteResponse.created).toBe(true);
    });

    it('should return a 200 status when a course is already favorited', async () => {
        const { courses, email, password } =
            await CourseFavoritesTestUtilModule.getCourseFavoritesWithCredentials(1);
        const sessionId = await auth.login(email, password);

        expect(courses.length).toBe(1);

        const response = await fetch(
            `${UNIT_TEST_URL_BASE}/api/user/course-favorites?course_id=${courses[0].courseId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    cookie: `${COOKIE_NAME}=${sessionId}`
                },
                method: 'POST'
            }
        );

        expect(response.status).toBe(200);

        const createFavoriteResponse: CreateFavoriteResponse = await response.json();
        expect(createFavoriteResponse.created).toBe(false);
    });

    it('should return a 400 status when the request payload is invalid or missing required fields', async () => {
        const { email, password } = await UserTestUtilModule.getUserWithCredentials();
        const sessionId = await auth.login(email, password);
        const response = await fetch(`${UNIT_TEST_URL_BASE}/api/user/course-favorites`, {
            headers: {
                'Content-Type': 'application/json',
                cookie: `${COOKIE_NAME}=${sessionId}`
            },
            method: 'POST'
        });

        expect(response.status).toBe(400);
    });
});
