import type { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedUser(client: PrismaClient) {
	const organizations = await client.organization.findMany();

	const numUsers = 1200;
	const users: User[] = [];

	for (let i = 0; i < numUsers; i++) {
		const includeOrganization = faker.datatype.boolean();
		const user: User = {
			id: i + 1,
			fullName: faker.name.fullName(),
			email: faker.internet.email(),
			organizationId: includeOrganization ? faker.helpers.arrayElement(organizations).id : null
		};
		users.push(user);
	}

	await client.user.createMany({ data: users });
}
