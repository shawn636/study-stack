// This library is used for initialzing default settings for the site.
import { db } from '$lib/server/database';

export const setDefaultSettings = async () => {
    await db
        .insertInto('SiteSetting')
        .ignore()
        .values([
            {
                siteSettingKey: 'display-test-records',
                siteSettingValue: false.toString()
            },
            {
                siteSettingKey: 'display-seed-records',
                siteSettingValue: true.toString()
            }
        ])
        .execute();
};
