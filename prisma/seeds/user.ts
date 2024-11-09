import type { AuthUser, Organization, PrismaClient, User } from '@prisma/client';

import { faker } from '@faker-js/faker';

import { cuid } from './utils';

export async function seedUser(client: PrismaClient) {
    const organizations: Organization[] = await client.organization.findMany();

    const numUsers = 100;
    const users: User[] = [];
    const authUsers: AuthUser[] = [];

    for (let i = 0; i < numUsers; i++) {
        const includeOrganization = faker.datatype.boolean();

        const email = faker.internet.email();
        const authUserId = faker.string.uuid().slice(0, 30);
        const userId = cuid();

        const authUser: AuthUser = {
            email: email,
            id: authUserId,
            recordType: 'SEED_RECORD',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const user: User = {
            areaCode: faker.phone.number().slice(0, 3),
            authUserId: authUser.id,
            bio: faker.lorem.paragraph(),
            city: faker.location.city(),
            countryCode: faker.location.countryCode(),
            email: faker.internet.email(),
            id: userId,
            name: faker.person.fullName(),
            organizationId: includeOrganization
                ? faker.helpers.arrayElement(organizations).id
                : null,
            phoneNumber: faker.phone.number().slice(3, 10),
            photoUrl: faker.image.avatar(),
            recordType: 'SEED_RECORD',
            platformRole: 'USER',
            photoImageId: faker.string.uuid(),
            state: faker.location.state(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        authUsers.push(authUser);
        users.push(user);
    }

    await client.authUser.createMany({ data: authUsers });
    await client.user.createMany({ data: users });
}
