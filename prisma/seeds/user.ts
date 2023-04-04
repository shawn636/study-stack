import type { PrismaClient, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedUser(client: PrismaClient) {
	const [organizations, _] = await Promise.all([
		client.organization.findMany({}),
		client.user.deleteMany({})
	]);

	const numUsers = 300;
	const users: User[] = [];

	for (let i = 0; i < numUsers; i++) {
		const includeOrganization = faker.datatype.boolean();
		const user: User = {
			id: i,
			fullName: faker.name.fullName(),
			email: faker.internet.email(),
			organizationId: includeOrganization ? faker.helpers.arrayElement(organizations).id : null
		};
		users.push(user);
	}

	await client.user.createMany({ data: users });
}
