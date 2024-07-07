import { apiClientSingleton as client } from '$lib/api';

import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
    const settings = {
        // Defaults
        'display-seed-records': true,
        'display-test-records': false
    };
    const result = await client.adminSettings.getMultiple(Object.keys(settings), fetch);
    const settingData = result.data;

    for (const setting of settingData) {
        if (setting.siteSettingKey in settings) {
            const key = setting.siteSettingKey as keyof typeof settings;
            settings[key] = setting.siteSettingValue === 'true';
        }
    }

    return { settings };
}) satisfies PageLoad;
