import type { CourseContent, Prisma, PrismaClient } from '@prisma/client';

import { faker } from '@faker-js/faker';
import { ContentType } from '@prisma/client';

import { cuid } from './utils';

const generateJson = (): Prisma.JsonValue => {
    const numKeys = faker.number.int({ max: 5, min: 1 });
    const json: Prisma.JsonValue = {};

    for (let i = 0; i < numKeys; i++) {
        const key = faker.lorem.word();
        const value = faker.lorem.sentence();
        json[key] = value;
    }

    return json;
};

export async function seedCourseContent(client: PrismaClient) {
    const [lessons, authors] = await Promise.all([
        client.lesson.findMany(),
        client.user.findMany()
    ]);

    // This type declaration is only because of an error with
    // prisma recognizing the JSON type in createMany
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contents: any = [];

    for (const lesson of lessons) {
        const numContent: number = faker.number.int({ max: 5, min: 0 });

        for (let i = 0; i < numContent; i++) {
            const content: CourseContent = {
                courseContentAuthorId: faker.helpers.arrayElement(authors).userId,
                courseContentId: cuid(),
                courseContentJson: generateJson(),
                courseContentLessonId: lesson.lessonId,
                courseContentRecordType: 'SEED_RECORD',
                courseContentType: faker.helpers.arrayElement(Object.values(ContentType))
            };
            contents.push(content);
        }
    }

    await client.courseContent.createMany({
        data: contents
    });
}
