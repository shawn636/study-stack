import type { Course, PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedCourse(client: PrismaClient) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [categories, users] = await Promise.all([
		client.category.findMany(),
		client.user.findMany()
	]);

	const numCourses = 30;
	const courses: Course[] = [];

	for (let i = 0; i < numCourses; i++) {
		const isDiscounted = faker.datatype.boolean();
		const price = parseFloat(faker.finance.amount(0.01, 1000.0, 2));
		const discountedPrice = price * faker.datatype.float({ min: 0.01, max: 0.99 });

		const course: Course = {
			id: i + 1,
			title: faker.lorem.sentence(),
			description: faker.lorem.paragraphs(),
			categoryId: faker.helpers.arrayElement(categories).id,
			price: new Prisma.Decimal(price),
			discountedPrice: isDiscounted ? new Prisma.Decimal(discountedPrice) : null,
			instructorId: faker.helpers.arrayElement(users).id
		};

		courses.push(course);
	}

	await client.course.createMany({ data: courses });
}
