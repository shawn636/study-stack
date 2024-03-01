import type { AuthUser, Organization, PrismaClient, User } from '@prisma/client';

import { faker } from '@faker-js/faker';

export async function seedUser(client: PrismaClient) {
    const organizations: Organization[] = await client.organization.findMany();

    const numUsers = 100;
    const users: User[] = [];
    const authUsers: AuthUser[] = [];

    for (let i = 0; i < numUsers; i++) {
        const includeOrganization = faker.datatype.boolean();

        const email = faker.internet.email();
        const authUserId = faker.string.uuid();
        const userId = i + 1;

        const authUser: AuthUser = {
            email: email,
            id: authUserId,
            user_id: userId
        };

        const user: User = {
            area_code: faker.phone.number().slice(0, 3),
            auth_user_id: authUserId,
            bio: faker.lorem.paragraph(),
            city: faker.location.city(),
            country_code: faker.location.countryCode(),
            email: faker.internet.email(),
            id: userId,
            name: faker.person.fullName(),
            organizationId: includeOrganization
                ? faker.helpers.arrayElement(organizations).id
                : null,
            phone_number: faker.phone.number().slice(3, 10),
            photo_url: faker.image.avatar(),
            state: faker.location.state()
        };
        authUsers.push(authUser);
        users.push(user);
    }

    await client.authUser.createMany({ data: authUsers });
    await client.user.createMany({ data: users });
}
