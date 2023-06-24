import type { PageServerLoad } from './$types';
import type Course from '$lib/models/course';
import { db } from '$lib/database';

export const load = (async () => {
    const conn = db.connection();

    const course_results = await conn.execute(`
        SELECT Course.id, Course.title, Course.description, Course.price, 
        Course.discountedPrice, Course.difficulty, Course.img_href, 
        Category.title AS category, User.name AS instructor, 
        Organization.name AS organization
        FROM Course JOIN Category ON Course.categoryId = Category.id
        JOIN User ON Course.instructorId = User.id
        JOIN Organization ON User.organizationId = Organization.id
        LIMIT 20`);

    const courses = course_results.rows as Course[];

    return { courses };
}) satisfies PageServerLoad;
