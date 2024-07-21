import type { PrismaClient } from '@prisma/client';

export async function seedSiteSettings(client: PrismaClient) {
    await Promise.all([
        client.siteSetting.upsert({
            create: {
                siteSettingKey: 'display-test-records',
                siteSettingValue: false.toString()
            },
            update: {},
            where: { siteSettingKey: 'display-test-records' }
        }),
        client.siteSetting.upsert({
            create: {
                siteSettingKey: 'display-seed-records',
                siteSettingValue: true.toString()
            },
            update: {},
            where: { siteSettingKey: 'display-seed-records' }
        })
    ]);
}
