import { faker } from '@faker-js/faker';
import type { PrismaClient, CourseContent, Prisma } from '@prisma/client';

export async function seedCourseContent(client: PrismaClient) {
    const [contentTypes, lessons, authors] = await Promise.all([
        client.contentType.findMany(),
        client.lesson.findMany(),
        client.user.findMany()
    ]);

    let contentId = 1;

    // This type declaration is only because of an error with
    // prisma recognizing the JSON type in createMany
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contents: any = [];

    for (const lesson of lessons) {
        const numContent: number = faker.datatype.number({ min: 0, max: 5 });

        for (let i = 0; i < numContent; i++) {
            const content: CourseContent = {
                id: contentId,
                contentTypeId: faker.helpers.arrayElement(contentTypes).id,
                lessonId: lesson.id,
                content: JSON.parse(faker.datatype.json()) as Prisma.JsonValue,
                authorId: faker.helpers.arrayElement(authors).id
            };
            contents.push(content);
            contentId += 1;
        }
    }

    await client.courseContent.createMany({
        data: contents
    });
}
