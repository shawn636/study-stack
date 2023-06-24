import type { PageServerLoad } from './$types';
import type Course from '$lib/models/course';
import { db } from '$lib/database';

export const load = (async () => {
    const conn = db.connection();

    const course_results = await conn.execute(`
        SELECT * FROM Course LIMIT 20`);

    const courses = course_results.rows as Course[];

    return { courses };
}) satisfies PageServerLoad;
