import { hashPassword, comparePassword } from '$lib/server/crypto';
import { v4 } from 'uuid';
import { db } from '$lib/server/database';
import type { Cookies } from '@sveltejs/kit';
import type User from '$lib/models/user';
import { dev } from '$app/environment';

export const COOKIE_NAME = 'auth_session';

/**
 * Checks if an email already exists in the database.
 *
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>} A Promise that resolves to true if the email exists, false otherwise.
 */
const emailExists = async (email: string): Promise<boolean> => {
    const conn = db.connection();
    const query = `SELECT COUNT(*) AS count FROM auth_user WHERE email = ?;`;
    const result = await conn.execute(query, [email]);
    const record_count = result.rows[0] as { count: string };
    return parseInt(record_count.count) > 0;
};

/**
 * Retrieves all session IDs associated with a user.
 *
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<string[]>} A Promise that resolves to an array of session IDs.
 */
const getAllSessions = async (user_id: string): Promise<string[]> => {
    const conn = db.connection();
    const query = 'SELECT id FROM auth_session WHERE auth_user_id = ?';
    const { rows } = await conn.execute(query, [user_id]);
    const sessions = rows as { id: string }[];
    return sessions.map((session) => session.id);
};

/**
 * Retrieves user information based on a session ID.
 *
 * @param {string} session_id - The ID of the session.
 * @returns {Promise<User>} A Promise that resolves to a User object.
 * @throws {Error} Throws an error if the session is invalid or the user cannot be found.
 */
const getUser = async (session_id: string): Promise<User> => {
    const valid_session = await validateSession(session_id);
    if (!valid_session) {
        console.error('Invalid session');
        throw Error('AUTH_INVALID_SESSION');
    }

    const conn = db.connection();

    const query = `SELECT User.id as id, User.email as email, User.name as name,
                   User.country_code as country_code, User.area_code as area_code,
                   User.phone_number as phone_number, User.bio as bio, User.city as city,
                   User.state as state, User.photo_url as photo_url
                   FROM auth_session JOIN User on auth_session.auth_user_id = User.auth_user_id 
                   WHERE auth_session.id = ?`;

    const { rows } = await conn.execute(query, [session_id]);
    const user = rows[0] as User;

    if (!user) {
        console.error('Unable to find user');
        throw Error('DB_SELECT_FAILED');
    }

    return user;
};

/**
 * Retrieves the user ID associated with a session ID.
 *
 * @param {string} session_id - The ID of the session.
 * @returns {Promise<string>} A Promise that resolves to the user ID.
 * @throws {Error} Throws an error if the session is invalid or the user cannot be found.
 */
const getUserId = async (session_id: string): Promise<string> => {
    const valid_session = await validateSession(session_id);
    if (!valid_session) {
        console.error('Invalid session');
        throw Error('AUTH_INVALID_SESSION');
    }

    const conn = db.connection();

    const query = `SELECT User.id as id
                   FROM auth_session JOIN User on auth_session.auth_user_id = User.auth_user_id 
                   WHERE auth_session.id = ?`;

    const { rows } = await conn.execute(query, [session_id]);
    const result = rows[0] as { id: string };

    if (!result) {
        console.error('Unable to find user');
        throw Error('DB_SELECT_FAILED');
    }

    return result.id;
};

/**
 * Creates a new user with the provided email, password, and name.
 *
 * @param {string} email - The email of the new user.
 * @param {string} password - The password of the new user.
 * @param {string} name - The name of the new user.
 * @returns {Promise<string>} A Promise that resolves to the auth_user_id of the created user.
 * @throws {Error} Throws an error if the email already exists or the user creation fails.
 */
const createUser = async (email: string, password: string, name: string): Promise<string> => {
    const email_exists = await emailExists(email);

    if (email_exists) {
        throw Error('AUTH_DUPLICATE_EMAIL');
    }

    const conn = db.connection();

    const user_id = await conn.transaction(async (tx) => {
        // Create auth_user
        const user_id = v4();
        const query = `INSERT INTO auth_user (id, email) VALUES (?, ?);`;
        const user_result = await tx.execute(query, [user_id, email]);

        if (user_result.insertId === null) {
            console.error('Unable to insert auth_user');
            throw Error('DB_INSERT_FAILED');
        }

        // Create auth_key
        const key_id = v4();
        const hashed_password = await hashPassword(password);
        const key_query =
            'INSERT INTO auth_key (id, auth_user_id, hashed_password) VALUES (?, ?, ?);';
        const key_result = await tx.execute(key_query, [key_id, user_id, hashed_password]);

        if (key_result.insertId === null) {
            console.error('Unable to insert auth_key');
            throw new Error('DB_INSERT_FAILED');
        }

        // Create User Profile
        const user_profile_query = 'INSERT INTO User (auth_user_id, name, email) VALUES (?, ?, ?);';
        const user_profile_result = await tx.execute(user_profile_query, [user_id, name, email]);

        if (user_profile_result.insertId === null) {
            console.error('Unable to insert User');
            throw Error('DB_INSERT_FAILED');
        }

        return user_id;
    });

    return user_id;
};

/**
 * Authenticates a user with the provided email and password.
 *
 * @param {string} email - The email of the user to authenticate.
 * @param {string} password - The password of the user to authenticate.
 * @returns {Promise<string>} A Promise that resolves to the session ID of the authenticated user.
 * @throws {Error} Throws an error if the email or password is invalid, or session creation fails.
 */
const login = async (email: string, password: string): Promise<string> => {
    const conn = db.connection();
    const getAuthUser = 'SELECT id FROM auth_user WHERE email = ?';
    const authUserResult = await conn.execute(getAuthUser, [email]);
    const user = authUserResult.rows[0] as { id: string };

    if (user === undefined) {
        console.error('AuthUser Not Found');
        throw Error('AUTH_INVALID_CREDENTIALS');
    }

    if (user.id === undefined) {
        console.error('AuthUser Not Found');
        throw Error('AUTH_INVALID_CREDENTIALS');
    }

    const getHashedPassword =
        'SELECT hashed_password as hashedPassword FROM auth_key WHERE auth_user_id = ?';
    const hashedPasswordResult = await conn.execute(getHashedPassword, [user.id]);

    if (hashedPasswordResult === undefined) {
        console.error('AuthKey not found');
        throw Error('DB_SELECT_FAILED');
    }
    const { hashedPassword } = hashedPasswordResult.rows[0] as { hashedPassword: string };

    if (hashedPassword === undefined) {
        console.error('AuthKey not found');
        throw Error('DB_SELECT_FAILED');
    }

    const isValid = await comparePassword(password, hashedPassword);

    if (!isValid) {
        console.error('Invalid Password');
        throw Error('AUTH_INVALID_CREDENTIALS');
    }

    const sessionId = v4();
    const createSession =
        'INSERT INTO auth_session (id, auth_user_id, expires) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY))';
    const sessionResult = await conn.execute(createSession, [sessionId, user.id]);

    if (sessionResult.insertId === null) {
        console.error('Unable to create session');
        throw Error('DB_INSERT_FAILED');
    }

    return sessionId;
};

/**
 * Logs out a user by deleting the session associated with the provided session ID.
 *
 * @param {string} session_id - The ID of the session to log out.
 * @returns {Promise<void>} A Promise that resolves when the logout is successful.
 * @throws {Error} Throws an error if the session is invalid or deletion fails.
 */
const logout = async (session_id: string): Promise<void> => {
    const conn = db.connection();
    const select_query = 'SELECT id FROM auth_session WHERE id = ?';
    const select_result = await conn.execute(select_query, [session_id]);

    if (select_result.rows.length !== 1) {
        console.error('Session not found');
        throw Error('AUTH_INVALID_SESSION');
    }

    const delete_session_query = 'DELETE FROM auth_session WHERE id = ?';
    const result = await conn.execute(delete_session_query, [session_id]);

    if (result.rowsAffected === 0) {
        console.error('Unable to delete session');
        throw Error('DB_DELETE_FAILED');
    }

    return;
};

/**
 * Logs out all sessions associated with a user.
 *
 * @param {string} auth_user_id - The ID of the user to log out.
 * @returns {Promise<void>} A Promise that resolves when all sessions are successfully logged out.
 * @throws {Error} Throws an error if the user or sessions are not found, or deletion fails.
 */
const logoutAll = async (auth_user_id: string): Promise<void> => {
    const conn = db.connection();
    const find_user_query = 'SELECT id FROM auth_user WHERE id = ?';
    const find_user_result = await conn.execute(find_user_query, [auth_user_id]);
    if (find_user_result.rows.length !== 1) {
        console.error('User not found');
        throw Error('AUTH_INVALID_SESSION');
    }

    const find_sessions_query = 'SELECT id FROM auth_session WHERE auth_user_id = ?';
    const find_sessions_result = await conn.execute(find_sessions_query, [auth_user_id]);
    if (find_sessions_result.rows.length === 0) {
        console.error('No sessions found for User');
        throw Error('AUTH_INVALID_SESSION');
    }

    const delete_sessions_query = 'DELETE FROM auth_session WHERE auth_user_id = ?';
    const delete_sessions_result = await conn.execute(delete_sessions_query, [auth_user_id]);
    if (delete_sessions_result.rowsAffected === 0) {
        console.error('Unable to delete sessions');
        throw Error('DB_DELETE_FAILED');
    }

    return;
};

/**
 * Validates if a session ID is valid.
 *
 * @param {string} session_id - The ID of the session to validate.
 * @returns {Promise<boolean>} A Promise that resolves to true if the session is valid, false otherwise.
 */
const validateSession = async (session_id: string): Promise<boolean> => {
    const conn = db.connection();
    const query = 'SELECT id FROM auth_session WHERE id = ?';
    const result = await conn.execute(query, [session_id]);
    return result.rows.length === 1;
};

/**
 * Retrieves the session ID from cookies.
 *
 * @param {Cookies} cookies - The cookies object.
 * @returns {string | undefined} The session ID if found in cookies, undefined otherwise.
 */
const getSession = (cookies: Cookies): string | undefined => {
    return cookies.get(COOKIE_NAME);
};

/**
 * Validates if the session ID stored in cookies is valid.
 *
 * @param {Cookies} cookies - The cookies object.
 * @returns {Promise<boolean>} A Promise that resolves to true if the session is valid, false otherwise.
 */
const validateCookies = async (cookies: Cookies): Promise<boolean> => {
    const session_id = cookies.get(COOKIE_NAME);
    if (session_id === undefined) {
        return false;
    }
    return await validateSession(session_id);
};

/**
 * Sets the session ID as a cookie.
 *
 * @param {string} session_id - The session ID to set as a cookie.
 * @param {Cookies} cookies - The cookies object.
 * @returns {Cookies} The updated cookies object.
 */
const setSessionCookie = (session_id: string, cookies: Cookies): Cookies => {
    cookies.set(COOKIE_NAME, session_id, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 30
    });

    return cookies;
};

/**
 * Deletes the session ID cookie.
 *
 * @param {Cookies} cookies - The cookies object.
 * @returns {Cookies} The updated cookies object.
 */
const deleteSessionCookie = (cookies: Cookies): Cookies => {
    cookies.set(COOKIE_NAME, 'null', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: 0
    });
    return cookies;
};

/**
 * Validates the session ID and sets it as a cookie if valid.
 *
 * @param {string} session_id - The session ID to validate and set as a cookie.
 * @param {Cookies} cookies - The cookies object.
 * @returns {Promise<Cookies>} A Promise that resolves to the updated cookies object.
 */
const validateAndSetCookie = async (session_id: string, cookies: Cookies): Promise<Cookies> => {
    const isValid = await validateSession(session_id);

    if (!isValid) {
        console.error('Invalid Session');
        return cookies;
    }

    return setSessionCookie(session_id, cookies);
};

/**
 * Deletes a user and associated data if it exists (dev mode only).
 *
 * @param {string} email - The email of the user to delete.
 * @returns {Promise<void>} A Promise that resolves when the user is successfully deleted.
 */
const deleteUserIfExists = async (email: string): Promise<void> => {
    if (!dev) {
        console.error('Unable to delete user outside of dev mode');
        return;
    }

    const conn = db.connection();

    const result = await conn.execute('SELECT id FROM auth_user WHERE email = ?', [email]);
    const result_obj = result.rows[0] as { id: string | undefined };

    if (result_obj?.id !== undefined) {
        await conn.transaction(async (tx) => {
            await tx.execute('DELETE FROM auth_user WHERE id = ?', [result_obj.id]);
            await tx.execute('DELETE FROM auth_key WHERE auth_user_id = ?', [result_obj.id]);
            await tx.execute('DELETE FROM auth_session WHERE auth_user_id = ?', [result_obj.id]);
            await tx.execute('DELETE FROM User WHERE auth_user_id = ?', [result_obj.id]);
        });
    }

    return;
};

/**
 * Exposes the authentication-related functions as properties of the 'auth' object.
 */
export const auth = {
    emailExists,
    getAllSessions,
    getUser,
    getUserId,
    createUser,
    login,
    logout,
    logoutAll,
    validateSession,
    validateAndSetCookie,
    setSessionCookie,
    validateCookies,
    getSession,
    deleteSessionCookie,
    deleteUserIfExists
};
