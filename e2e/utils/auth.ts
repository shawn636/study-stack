import { DATABASE_URL } from './env';
import { Client } from '@planetscale/database';

export const db = new Client({
    url: DATABASE_URL
});

const deleteUserIfExists = async (email: string): Promise<void> => {
    const conn = db.connection();

    const result = await conn.execute('SELECT id FROM auth_user WHERE email = ?', [email]);
    const result_obj = result.rows[0] as { id: string | undefined };

    if (result_obj?.id !== undefined) {
        await conn.execute('DELETE FROM auth_user WHERE id = ?', [result_obj.id]);
        await conn.execute('DELETE FROM auth_key WHERE auth_user_id = ?', [result_obj.id]);
        await conn.execute('DELETE FROM auth_session WHERE auth_user_id = ?', [result_obj.id]);
        await conn.execute('DELETE FROM User WHERE auth_user_id = ?', [result_obj.id]);
    }

    return;
};

export const auth = {
    deleteUserIfExists
};
