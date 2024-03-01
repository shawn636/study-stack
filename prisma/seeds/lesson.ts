import type { Course, Lesson, PrismaClient } from '@prisma/client';

import { faker } from '@faker-js/faker';

export async function seedLesson(client: PrismaClient) {
    const courses: Course[] = await client.course.findMany();
    const lessons: Lesson[] = [];

    let lessonId = 1;
    for (const course of courses) {
        const numLessons = faker.number.int({ max: 10, min: 0 });

        for (let i = 0; i < numLessons; i++) {
            const lesson: Lesson = {
                courseId: course.id,
                id: lessonId,
                title: faker.lorem.sentence()
            };
            lessons.push(lesson);
            lessonId += 1;
        }
    }

    await client.lesson.createMany({ data: lessons });
}
