import type { Course, PrismaClient } from '@prisma/client';

import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

export async function seedCourse(client: PrismaClient) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [categories, users, organizations, lessons] = await Promise.all([
        client.category.findMany(),
        client.user.findMany(),
        client.organization.findMany(),
        client.lesson.findMany()
    ]);

    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    const numCourses = 30;
    const courses: Course[] = [];

    for (let i = 0; i < numCourses; i++) {
        const isDiscounted = faker.datatype.boolean();
        const price = parseFloat(faker.finance.amount({ dec: 2, max: 1000.0, min: 0.01 }));
        const discountedPrice = price * faker.number.float({ max: 0.99, min: 0.01 });

        const category = faker.helpers.arrayElement(categories);
        const instructor = faker.helpers.arrayElement(users);
        const hasOrg = instructor.organizationId !== null;
        const organization = hasOrg
            ? String(organizations.find((org) => org.id === instructor.organizationId))
            : null;

        const lessonCnt = lessons.filter((lesson) => {
            lesson.courseId === i + 1;
        }).length;

        const course: Course = {
            category: category.title,
            categoryId: category.id,
            current_price: new Prisma.Decimal(discountedPrice),
            description: faker.commerce.productDescription(),
            difficulty: faker.helpers.arrayElement(difficulties),
            estimated_time_hours: faker.number.int({ max: 100, min: 0 }),
            estimated_time_minutes: faker.number.int({ max: 59, min: 0 }),
            id: i + 1,
            img_href: 'images/course-image.webp',
            instructor: instructor.name,
            instructorId: instructor.id,
            lesson_cnt: lessonCnt,
            organization: hasOrg ? organization : null,
            original_price: isDiscounted
                ? new Prisma.Decimal(price)
                : new Prisma.Decimal(discountedPrice),
            rating_avg: faker.number.float({ max: 5, min: 0 }),
            rating_cnt: faker.number.int({ max: 1000, min: 0 }),
            title: faker.commerce.productName()
        };

        courses.push(course);
    }

    await client.course.createMany({ data: courses });
}
