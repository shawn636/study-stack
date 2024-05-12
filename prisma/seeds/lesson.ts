import type { Course, Lesson, PrismaClient } from '@prisma/client';

import { faker } from '@faker-js/faker';

import { cuid } from './utils';

export async function seedLesson(client: PrismaClient) {
    const courses: Course[] = await client.course.findMany();
    const lessons: Lesson[] = [];

    const courseUpdates: Partial<Course>[] = [];

    for (const course of courses) {
        const numLessons = faker.number.int({ max: 10, min: 0 });
        courseUpdates.push({
            courseId: course.courseId,
            lessonCount: numLessons
        });

        for (let i = 0; i < numLessons; i++) {
            const lesson: Lesson = {
                courseId: course.courseId,
                lessonId: cuid(),
                lessonTitle: faker.lorem.sentence()
            };
            lessons.push(lesson);
        }
    }

    await client.lesson.createMany({ data: lessons });

    await Promise.all(
        courseUpdates.map(async (course) => {
            await client.course.update({
                data: { lessonCount: course.lessonCount },
                where: { courseId: course.courseId }
            });
        })
    );
}
