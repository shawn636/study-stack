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
            authUserEmail: email,
            authUserId: authUserId
        };

        const user: User = {
            authUserId: authUser.authUserId,
            organizationId: includeOrganization
                ? faker.helpers.arrayElement(organizations).organizationId
                : null,
            userAreaCode: faker.phone.number().slice(0, 3),
            userBio: faker.lorem.paragraph(),
            userCity: faker.location.city(),
            userCountryCode: faker.location.countryCode(),
            userEmail: faker.internet.email(),
            userId: userId,
            userName: faker.person.fullName(),
            userPhoneNumber: faker.phone.number().slice(3, 10),
            userPhotoUrl: faker.image.avatar(),
            userRole: faker.helpers.arrayElement(['admin', 'user']),
            userState: faker.location.state()
        };

        authUsers.push(authUser);
        users.push(user);
    }

    await client.authUser.createMany({ data: authUsers });
    await client.user.createMany({ data: users });
}
