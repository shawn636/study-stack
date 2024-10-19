import type { Course, User } from '$lib/models/types/database.types';
import type { CourseGetResponse } from '$lib/api/types/courses';
import type { Selectable } from 'kysely';

import { DatabaseError, InvalidParameterError } from '$lib/server/error-handling/handled-errors';

import { db } from '$lib/server/database';
import { getRecordDisplaySettings } from '$lib/server/util';
import { handleErrors } from '$lib/server/error-handling';

import type { RequestHandler } from './$types';

export const GET = (async ({ params }) => {
    try {
        const slug = params.slug;

        if (!slug) {
            throw new InvalidParameterError('Invalid slug');
        }
        let courseResult: Selectable<Course> | null = null;
        let userResult: Selectable<User> | null = null;

        const options = await getRecordDisplaySettings();

        try {
            courseResult = await db
                .selectFrom('Course')
                .innerJoin('User', 'Course.instructorId', 'User.id')
                .selectAll('Course')
                .select(['Course.id as courseId', 'User.id as instructorId'])
                .$if(!options['display-test-records'], (qb) =>
                    qb.where('recordType', '!=', 'TEST_RECORD')
                )
                .$if(!options['display-seed-records'], (qb) =>
                    qb.where('recordType', '!=', 'SEED_RECORD')
                )
                .where('Course.id', '=', slug)
                .executeTakeFirstOrThrow();

            userResult = await db
                .selectFrom('Course')
                .innerJoin('User', 'Course.instructorId', 'User.id')
                .selectAll('User')
                .select(['Course.id as courseId', 'User.id as instructorId'])
                .$if(!options['display-test-records'], (qb) =>
                    qb.where('recordType', '!=', 'TEST_RECORD')
                )
                .$if(!options['display-seed-records'], (qb) =>
                    qb.where('recordType', '!=', 'SEED_RECORD')
                )
                .where('Course.id', '=', slug)
                .executeTakeFirstOrThrow();
        } catch (e) {
            throw new DatabaseError(`Error fetching course: ${e}`);
        }

        const finalResult: CourseGetResponse = {
            count: 1,
            data: {
                course: courseResult,
                instructor: userResult
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
