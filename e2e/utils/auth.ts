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
    const userId = v4();
    const query = `INSERT INTO auth_user (id, email) VALUES (?, ?);`;
    const userResult = await conn.execute(query, [userId, email]);

    if (userResult.insertId === null) {
        console.error('Unable to insert auth_user');
        throw Error('DB_INSERT_FAILED');
    }

    // Create auth_key
    const keyId = v4();
    const hashedPassword = await hashPassword(password);
    const keyQuery = 'INSERT INTO auth_key (id, auth_user_id, hashed_password) VALUES (?, ?, ?);';
    const keyResult = await conn.execute(keyQuery, [keyId, userId, hashedPassword]);

    if (keyResult.insertId === null) {
        console.error('Unable to insert auth_key');
        throw new Error('DB_INSERT_FAILED');
    }

    // Create User Profile
    const userProfileQuery = 'INSERT INTO User (auth_user_id, name, email) VALUES (?, ?, ?);';
    const userProfileResult = await conn.execute(userProfileQuery, [userId, name, email]);

    if (userProfileResult.insertId === null) {
        console.error('Unable to insert User');
        throw Error('DB_INSERT_FAILED');
    }

    return userId;
};

const deleteUserIfExists = async (email: string): Promise<void> => {
    const conn = db.connection();

    const result = await conn.execute('SELECT id FROM auth_user WHERE email = ?', [email]);
    const resultObject = result.rows[0] as { id: string | undefined };

    if (resultObject?.id !== undefined) {
        await conn.execute('DELETE FROM auth_user WHERE id = ?', [resultObject.id]);
        await conn.execute('DELETE FROM auth_key WHERE auth_user_id = ?', [resultObject.id]);
        await conn.execute('DELETE FROM auth_session WHERE auth_user_id = ?', [resultObject.id]);
        await conn.execute('DELETE FROM User WHERE auth_user_id = ?', [resultObject.id]);
    }

    return;
};

export const auth = {
    createUser,
    deleteUserIfExists
};
