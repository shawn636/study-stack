import type { PrismaClient } from '@prisma/client';

export async function deleteAll(client: PrismaClient) {
    await client.course.deleteMany();
    await Promise.all([
        client.category.deleteMany(),
        client.authUser.deleteMany(),
        client.user.deleteMany()
    ]);
    await client.organization.deleteMany();
}
