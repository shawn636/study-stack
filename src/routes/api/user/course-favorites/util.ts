import type { Cookies } from '@sveltejs/kit';

import { auth } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { error } from '@sveltejs/kit';

type ValidatedAPIData = {
    userCourseFavoriteCourseId: string;
    userCourseFavoriteUserId: string;
};

export const getValidatedApiData = async (
    cookies: Cookies,
    url: URL,
    courseIdRequired = true
): Promise<ValidatedAPIData> => {
    const sessionId = auth.getSession(cookies) ?? '';
    const validSession = auth.validateSession(sessionId);

    if (!sessionId || !validSession) {
        error(401, 'You are not logged in.');
    }

    const userId = await auth.getUserId(sessionId);
    const courseId = url.searchParams.get('course_id');

    if (courseIdRequired && !courseId) {
        error(400, 'Invalid course ID');
    }
    if (!userId) {
        error(401, 'Invalid user ID');
    }

    return { userCourseFavoriteCourseId: courseId ?? '', userCourseFavoriteUserId: userId };
};

export const courseExists = async (courseId: string): Promise<boolean> => {
    const course = await db
        .selectFrom('Course')
        .select('Course.courseId')
        .where('Course.courseId', '=', courseId)
        .executeTakeFirst();

    return !!course;
};
