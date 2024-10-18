import type { Course, PrismaClient } from '@prisma/client';

import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { cuid } from './utils';

export async function seedCourse(client: PrismaClient) {
    const [categories, users, organizations] = await Promise.all([
        client.category.findMany(),
        client.user.findMany(),
        client.organization.findMany()
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
        const hasOrg = instructor.userOrganizationId !== null;
        const organization = hasOrg
            ? organizations.find((org) => org.organizationId === instructor.userOrganizationId)
            : null;

        const course: Course = {
            courseCategoryId: category.categoryId,
            courseCurrentPrice: new Prisma.Decimal(discountedPrice),
            courseDescription: faker.commerce.productDescription(),
            courseDifficulty: faker.helpers.arrayElement(difficulties),
            courseEstimatedTimeHours: faker.number.int({ max: 100, min: 0 }),
            courseEstimatedTimeMinutes: faker.number.int({ max: 59, min: 0 }),
            courseId: cuid(),
            courseImgHref: 'images/course-image.webp',
            courseInstructorId: instructor.userId,
            courseLessonCount: 0,
            courseOrganizationId: organization?.organizationId ?? null,
            courseOriginalPrice: isDiscounted
                ? new Prisma.Decimal(price)
                : new Prisma.Decimal(discountedPrice),
            courseRatingAverage: faker.number.float({ max: 5, min: 0 }),
            courseRatingCount: faker.number.int({ max: 1000, min: 0 }),
            courseRecordType: 'SEED_RECORD',
            courseTitle: faker.commerce.productName()
        };

        courses.push(course);
    }

    await client.course.createMany({ data: courses });
}
