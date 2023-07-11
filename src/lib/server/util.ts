import type TableSchema from '$lib/models/table-schema';
import { db } from '$lib/server/database';

export const sleep = async (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

export const errorPadding = async () => {
    const minPadding = 100;
    const maxPaddingTime = 500;
    const paddingTime = Math.floor(Math.random() * (maxPaddingTime - minPadding + 1) + minPadding);
    await sleep(paddingTime);
};

export const getSchema = async (table: string) => {
    const conn = db.connection();

    const query = `
        SELECT c.COLUMN_NAME AS field, c.DATA_TYPE AS type, c.IS_NULLABLE AS nullable,
        k.CONSTRAINT_NAME AS constraint_name, c.COLUMN_DEFAULT AS default_value, c.EXTRA AS extra
        FROM INFORMATION_SCHEMA.COLUMNS AS c
        LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS k
            ON c.TABLE_SCHEMA = k.TABLE_SCHEMA
            AND c.TABLE_NAME = k.TABLE_NAME
            AND c.COLUMN_NAME = k.COLUMN_NAME
        WHERE c.TABLE_NAME = ?`;

    const result = await conn.execute(query, [table]);

    const schema = result.rows as TableSchema[];
    return schema;
};
