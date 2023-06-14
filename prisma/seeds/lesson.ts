import type { PrismaClient, Course, Lesson } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedLesson(client: PrismaClient) {
    const courses: Course[] = await client.course.findMany();
    const lessons: Lesson[] = [];

    let lessonId = 1;
    for (const course of courses) {
        const numLessons = faker.datatype.number({ min: 0, max: 10 });

        for (let i = 0; i < numLessons; i++) {
            const lesson: Lesson = {
                id: lessonId,
                title: faker.lorem.sentence(),
                courseId: course.id
            };
            lessons.push(lesson);
            lessonId += 1;
        }
    }

    await client.lesson.createMany({ data: lessons });
}
