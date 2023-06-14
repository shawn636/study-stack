import { DATABASE_URL } from './env';
import { Client } from '@planetscale/database';
import { v4 } from 'uuid';
import { hashPassword } from './crypto';

export const db = new Client({
    url: DATABASE_URL
});

const createUser = async (email: string, password: string, name: string): Promise<string> => {
    const conn = db.connection();

    // Create auth_user
    const user_id = v4();
    const query = `INSERT INTO auth_user (id, email) VALUES (?, ?);`;
    const user_result = await conn.execute(query, [user_id, email]);

    if (user_result.insertId === null) {
        console.error('Unable to insert auth_user');
        throw Error('DB_INSERT_FAILED');
    }

    // Create auth_key
    const key_id = v4();
    const hashed_password = await hashPassword(password);
    const key_query = 'INSERT INTO auth_key (id, auth_user_id, hashed_password) VALUES (?, ?, ?);';
    const key_result = await conn.execute(key_query, [key_id, user_id, hashed_password]);

    if (key_result.insertId === null) {
        console.error('Unable to insert auth_key');
        throw new Error('DB_INSERT_FAILED');
    }

    // Create User Profile
    const user_profile_query = 'INSERT INTO User (auth_user_id, name, email) VALUES (?, ?, ?);';
    const user_profile_result = await conn.execute(user_profile_query, [user_id, name, email]);

    if (user_profile_result.insertId === null) {
        console.error('Unable to insert User');
        throw Error('DB_INSERT_FAILED');
    }

    return user_id;
};

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
    createUser,
    deleteUserIfExists
};
