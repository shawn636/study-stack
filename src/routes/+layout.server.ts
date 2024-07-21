import { db, sql } from '$lib/server/database';
import { setDefaultSettings } from '$lib/server/site-config';

import type { LayoutServerLoad } from './$types';

export const load = (async () => {
    let databaseConnectionSuccessful = false;

    try {
        const result = await sql<{ solution: number }>`select 1 + 1 as solution`.execute(db);
        if (result.rows.length === 1 && Number(result.rows[0].solution) === 2) {
            databaseConnectionSuccessful = true;
        }

        await setDefaultSettings();
    } catch (error) {
        console.error('Error: Unable to establish connection between server and database');
    }

    return { databaseConnectionSuccessful };
}) satisfies LayoutServerLoad;
