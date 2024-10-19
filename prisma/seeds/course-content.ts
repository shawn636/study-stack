import type { CourseContent, Prisma, PrismaClient } from '@prisma/client';

import { ContentType } from '@prisma/client';
import { faker } from '@faker-js/faker';

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
                authorId: faker.helpers.arrayElement(authors).id,
                id: cuid(),
                json: generateJson(),
                lessonId: lesson.id,
                recordType: 'SEED_RECORD',
                contentType: faker.helpers.arrayElement(Object.values(ContentType))
            };
            contents.push(content);
        }
    }

    await client.courseContent.createMany({
        data: contents
    });
}
