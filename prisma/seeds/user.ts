import type { PrismaClient, AuthUser, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedUser(client: PrismaClient) {
	const organizations = await client.organization.findMany();

	const numUsers = 100;
	const users: User[] = [];
	const authUsers: AuthUser[] = [];

	for (let i = 0; i < numUsers; i++) {
		const includeOrganization = faker.datatype.boolean();

		const email = faker.internet.email();
		const auth_user_id = faker.datatype.uuid();
		const user_id = i + 1;

		const auth_user: AuthUser = {
			id: auth_user_id,
			email: email,
			user_id: user_id
		};

		const user: User = {
			id: user_id,
			email: faker.internet.email(),
			name: faker.name.fullName(),
			organizationId: includeOrganization ? faker.helpers.arrayElement(organizations).id : null,
			auth_user_id: auth_user_id
		};
		authUsers.push(auth_user);
		users.push(user);
	}

	await client.authUser.createMany({ data: authUsers });
	await client.user.createMany({ data: users });
}
