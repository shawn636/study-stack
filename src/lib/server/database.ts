import type { DB } from '$lib/models/types/database.types';

import { DATABASE_URL } from '$env/static/private';
import { init } from '@paralleldrive/cuid2';
import { Kysely, sql as KyselySql, Transaction as KyselyTransaction } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';

export const cuid = init({
    length: 30
});

export const db = new Kysely<DB>({
    dialect: new PlanetScaleDialect({
        url: DATABASE_URL
    })
});

export type Transaction = KyselyTransaction<DB>;
export const sql = KyselySql;
