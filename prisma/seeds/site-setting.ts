import type { PrismaClient } from '@prisma/client';

export async function seedSiteSettings(client: PrismaClient) {
    await Promise.all([
        client.siteSetting.upsert({
            create: {
                key: 'display-test-records',
                value: false.toString()
            },
            update: {},
            where: { key: 'display-test-records' }
        }),
        client.siteSetting.upsert({
            create: {
                key: 'display-seed-records',
                value: true.toString()
            },
            update: {},
            where: { key: 'display-seed-records' }
        })
    ]);
}
