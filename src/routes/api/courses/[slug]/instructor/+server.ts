import type { CourseInstructorGetResponse } from '$lib/api/types/courses';
import type { User } from '$lib/models/types/database.types';

import {
    DatabaseError,
    InvalidSlugError,
    NotFoundError
} from '$lib/server/error-handling/handled-errors';

import { db } from '$lib/server/database';
import { getRecordDisplaySettings } from '$lib/server/util';
import { handleErrors } from '$lib/server/error-handling';

import type { RequestHandler } from './$types';

export const GET = (async ({ params }) => {
    try {
        const courseId = params.slug;

        if (!courseId) {
            throw new InvalidSlugError('Course ID is required');
        }

        const options = await getRecordDisplaySettings();

        let result: User | null = null;

        try {
            const dbResult = await db
                .selectFrom('User')
                .innerJoin('Course', 'Course.courseInstructorId', 'User.userId')
                .selectAll('User')
                .where('Course.courseId', '=', courseId)
                .$if(!options['display-test-records'], (qb) =>
                    qb
                        .where('Course.courseRecordType', '!=', 'TEST_RECORD')
                        .where('User.userRecordType', '!=', 'TEST_RECORD')
                )
                .$if(!options['display-seed-records'], (qb) =>
                    qb
                        .where('Course.courseRecordType', '!=', 'SEED_RECORD')
                        .where('User.userRecordType', '!=', 'SEED_RECORD')
                )
                .executeTakeFirstOrThrow();
            result = dbResult as unknown as User;
        } catch (e) {
            throw new DatabaseError(`Error fetching course instructor: ${e}`);
        }

        if (!result) {
            throw new NotFoundError('Course not found');
        }

        const responsePayload: CourseInstructorGetResponse = {
            count: 1,
            data: result,
            object: 'Instructor',
            success: true
        };

        return new Response(JSON.stringify(responsePayload), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return handleErrors(e);
    }
}) satisfies RequestHandler;
