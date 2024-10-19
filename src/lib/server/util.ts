import type { RecordDisplaySettings } from '$lib/models/types/record-display-settings';

// import { env } from '$env/dynamic/private';
import { db } from '$lib/server/database';

import { NotFoundError } from './error-handling/handled-errors';

/**
 * Delays execution for the specified number of milliseconds.
 */
export const sleep = async (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

/**
 * Adds a random padding delay to simulate error conditions.
 */
export const errorPadding = async (minPaddingMs: number = 100, maxPaddingMs: number = 500) => {
    const paddingTime = Math.floor(
        Math.random() * (maxPaddingMs - minPaddingMs + 1) + minPaddingMs
    );
    await sleep(paddingTime);
};

export const getRecordDisplaySettings = async () => {
    const results = await db
        .selectFrom('SiteSetting')
        .select(['key', 'value'])
        .where('SiteSetting.recordType', '=', 'PRODUCTION_RECORD')
        .where((eb) =>
            eb.or([eb('key', '=', 'display-test-records'), eb('key', '=', 'display-seed-records')])
        )
        .execute();

    const expectedKeys = ['display-test-records', 'display-seed-records'];

    if (results.length !== 2) {
        throw new NotFoundError('Unable to retrieve values for site record display settings.');
    }

    const settings: Record<string, boolean> = {};
    results.forEach((result) => {
        if (expectedKeys.includes(result.key)) {
            settings[result.key] = result.value === 'true';
        }
    });

    // This is safe because the site setting key is unique, and the query only returns
    // a maximum of two results. So if there are exactly two results, we can safely
    // cast the settings object to the expected type, since we know it contains the
    // correct keys.
    const formattedSettings = settings as unknown as RecordDisplaySettings;

    // Override the display-test-records setting if the TEST environment variable is set.
    if (import.meta.env.MODE === 'test') {
        formattedSettings['display-test-records'] = true;
    }

    return formattedSettings;
};
