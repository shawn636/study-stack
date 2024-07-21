import type { CourseGetResponse } from '$lib/api/types/courses';
import type { Course, User } from '$lib/models/types/database.types';

import { db } from '$lib/server/database';
import { handleErrors } from '$lib/server/error-handling';
import {
    DatabaseError,
    InvalidParameterError,
    NotFoundError
} from '$lib/server/error-handling/handled-errors';
import { getRecordDisplaySettings } from '$lib/server/util';

import type { RequestHandler } from './$types';

export const GET = (async ({ params }) => {
    try {
        const slug = params.slug;

        if (!slug) {
            throw new InvalidParameterError('Invalid slug');
        }
        let courseResult: (Course & User) | null = null;

        const options = await getRecordDisplaySettings();

        try {
            const result = await db
                .selectFrom('Course')
                .innerJoin('User', 'Course.courseInstructorId', 'User.userId')
                .selectAll(['Course', 'User'])
                .$if(!options['display-test-records'], (qb) =>
                    qb.where('courseRecordType', '!=', 'TEST_RECORD')
                )
                .$if(!options['display-seed-records'], (qb) =>
                    qb.where('courseRecordType', '!=', 'SEED_RECORD')
                )
                .where('Course.courseId', '=', slug)
                .executeTakeFirstOrThrow();

            courseResult = result as unknown as Course & User;
        } catch (e) {
            throw new DatabaseError(`Error fetching course: ${e}`);
        }

        if (!courseResult) {
            throw new NotFoundError(`Course not found: ${slug}`);
        }

        // We are using `any` here to dynamically assign values to `course` and `instructor`.
        // TypeScript does not allow dynamic keys without an index signature, and adding
        // such a signature would undermine type safety across the codebase.
        // Since in the kysely query we are using selectAll(['Course', 'User']), we know that
        // the result will contain all fields of `Course` and `User`. We are also using the
        // `CourseResult` type to ensure that the keys are correct. Therefore, we can safely
        // cast the result to `Course` and `User` types. This is a trade-off between type safety
        // and code readability/dynamism. We are opting for the latter in this case.

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const course: any = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const instructor: any = {};

        Object.entries(courseResult).forEach(([key, value]) => {
            if (key.startsWith('course')) {
                course[key] = value;
            } else if (key.startsWith('user')) {
                instructor[key] = value;
            }
        });

        const finalResult: CourseGetResponse = {
            count: 1,
            data: {
                course: course as Course,
                instructor: instructor as User
            },
            object: 'Course',
            success: true
        };

        const json = JSON.stringify(finalResult);
        return new Response(json, {
            headers: {
                'cache-control': 'public, max-age=3600',
                'content-type': 'application/json;charset=UTF-8'
            }
        });
    } catch (e) {
        return handleErrors(e);
    }
}) satisfies RequestHandler;
