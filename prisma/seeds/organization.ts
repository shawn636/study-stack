import type { Organization, PrismaClient } from '@prisma/client';

import { faker } from '@faker-js/faker';

export async function seedOrganization(client: PrismaClient) {
    const numOrganizations = 50;
    const organizations: Organization[] = [];

    for (let i = 0; i < numOrganizations; i++) {
        const organization: Organization = {
            description: faker.company.catchPhrase(),
            id: i + 1,
            name: faker.company.name()
        };

        organizations.push(organization);
    }

    await client.organization.createMany({ data: organizations });
}
