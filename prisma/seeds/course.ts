import type { Course, PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

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
        const price = parseFloat(faker.finance.amount(0.01, 1000.0, 2));
        const discountedPrice = price * faker.datatype.float({ min: 0.01, max: 0.99 });

        const category = faker.helpers.arrayElement(categories);
        const instructor = faker.helpers.arrayElement(users);
        const has_org = instructor.organizationId !== null;
        const organization = has_org
            ? String(organizations.find((org) => org.id === instructor.organizationId))
            : null;

        const lesson_cnt = lessons.filter((lesson) => {
            lesson.courseId === i + 1;
        }).length;

        const course: Course = {
            id: i + 1,
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            category: category.title,
            categoryId: category.id,
            current_price: new Prisma.Decimal(discountedPrice),
            original_price: isDiscounted
                ? new Prisma.Decimal(price)
                : new Prisma.Decimal(discountedPrice),
            instructorId: instructor.id,
            instructor: instructor.name,
            organization: has_org ? organization : null,
            difficulty: faker.helpers.arrayElement(difficulties),
            img_href: 'images/course-image.webp',
            estimated_time_hours: faker.datatype.number({ min: 0, max: 100 }),
            estimated_time_minutes: faker.datatype.number({ min: 0, max: 59 }),
            lesson_cnt: lesson_cnt,
            rating_cnt: faker.datatype.number({ min: 0, max: 1000 }),
            rating_avg: faker.datatype.float({ min: 0, max: 5 })
        };

        courses.push(course);
    }

    await client.course.createMany({ data: courses });
}
