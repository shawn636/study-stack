import type { Organization, PrismaClient } from '@prisma/client';

import { faker } from '@faker-js/faker';

import { cuid } from './utils';

export async function seedOrganization(client: PrismaClient) {
    const numOrganizations = 50;
    const organizations: Organization[] = [];

    for (let i = 0; i < numOrganizations; i++) {
        const organization: Organization = {
            organizationDescription: faker.company.catchPhrase(),
            organizationId: cuid(),
            organizationName: faker.company.name(),
            organizationRecordType: 'SEED_RECORD'
        };

        organizations.push(organization);
    }

    await client.organization.createMany({ data: organizations });
}
