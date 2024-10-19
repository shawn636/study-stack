// This library is used for initialzing default settings for the site.
import { db } from '$lib/server/database';

export const setDefaultSettings = async () => {
    await db
        .insertInto('SiteSetting')
        .ignore()
        .values([
            {
                key: 'display-test-records',
                value: false.toString()
            },
            {
                key: 'display-seed-records',
                value: true.toString()
            }
        ])
        .execute();
};
