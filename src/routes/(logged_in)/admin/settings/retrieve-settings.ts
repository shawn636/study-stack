// // import type { Settings, SettingsKey } from '$lib/models/types/api';
// import type { SiteSetting } from '$lib/api/types/admin-settings';

// import { RecordType } from '$lib/models/types/database.types';
// import { db } from '$lib/server/database';

// const settingsToRetrieve: SettingsKey[] = ['display-test-records', 'display-seed-records'];

// export async function getSettings(): Promise<Settings> {
//     const settingsFromDB = await db
//         .selectFrom('SiteSetting')
//         .select(['SiteSetting.siteSettingKey', 'SiteSetting.siteSettingValue'])
//         .where('siteSettingKey', 'in', settingsToRetrieve)
//         .where('siteSettingRecordType', '=', RecordType.PRODUCTION_RECORD)
//         .execute();

//     const currentSettings: Settings = {
//         'display-seed-records': false,
//         'display-test-records': false
//     };

//     for (const key of settingsToRetrieve) {
//         const value = settingsFromDB.find((setting) => setting.siteSettingKey === key);
//         if (value && key in currentSettings) {
//             currentSettings[key] = value.siteSettingValue === 'true';
//         }
//     }

//     return currentSettings;
// }

// export async function updateSettings(settings: Settings): Promise<void> {
//     const settingsToUpdate = Object.entries(settings).map(([key, value]) => ({
//         siteSettingKey: key,
//         siteSettingValue: value.toString()
//     }));

//     console.log(settingsToUpdate);
// }
