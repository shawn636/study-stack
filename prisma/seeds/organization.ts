import type { Organization, PrismaClient } from '@prisma/client';

import { faker } from '@faker-js/faker';

import { cuid } from './utils';

export async function seedOrganization(client: PrismaClient) {
    const numOrganizations = 50;
    const organizations: Organization[] = [];

    for (let i = 0; i < numOrganizations; i++) {
        const organization: Organization = {
            description: faker.company.catchPhrase(),
            id: cuid(),
            name: faker.company.name(),
            recordType: 'SEED_RECORD',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        organizations.push(organization);
    }

    await client.organization.createMany({ data: organizations });
}
