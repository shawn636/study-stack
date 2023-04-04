import type { Organization, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

export async function seedOrganization(client: PrismaClient) {
	await client.organization.deleteMany({});

	const numOrganizations = 10;
	const organizations: Organization[] = [];

	for (let i = 0; i < numOrganizations; i++) {
		const organization: Organization = {
			id: i,
			name: faker.company.name(),
			description: faker.company.catchPhrase()
		};

		organizations.push(organization);
	}

	await client.organization.createMany({ data: organizations });
}
