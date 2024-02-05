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

    if (result.rows.length !== 1) {
        console.error('Invalid result structure');
        throw Error('DB_SELECT_FAILED');
    }

    const recordCount = result.rows[0] as { count: string };
    return parseInt(recordCount.count) > 0;
};

/**
 * Retrieves all session IDs associated with a user.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string[]>} A Promise that resolves to an array of session IDs.
 */
const getAllSessions = async (userId: string): Promise<string[]> => {
    const conn = db.connection();
    const query = 'SELECT id FROM auth_session WHERE auth_user_id = ?';
    const { rows } = await conn.execute(query, [userId]);

    // Confirm that rows conforms to the expected structure
    const sessions = rows.map((row) => {
        if (!row || typeof row.id !== 'string') {
            throw new Error('Invalid session structure');
        }
        return row;
    });
    return sessions.map((session) => session.id);
};

/**
 * Retrieves user information based on a session ID.
 *
 * @param {string} sessionId - The ID of the session.
 * @returns {Promise<User>} A Promise that resolves to a User object.
 * @throws {Error} Throws an error if the session is invalid or the user cannot be found.
 */
const getUser = async (sessionId: string): Promise<User> => {
    const validSession = await validateSession(sessionId);
    if (!validSession) {
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

    const { rows } = await conn.execute(query, [sessionId]);

    if (rows.length !== 1) {
        console.error('Unable to find user');
        throw Error('DB_SELECT_FAILED');
    }

    const userRow = rows[0];

    // id: string;
    // email: string;
    // name: string;
    // country_code: string | null;
    // area_code: string | null;
    // phone_number: string | null;
    // bio: string | null;
    // city: string | null;
    // state: string | null;
    // photo_url: string | null;

    const userProperties = [
        'id',
        'email',
        'name',
        'country_code',
        'area_code',
        'phone_number',
        'bio',
        'city',
        'state',
        'photo_url'
    ];

    for (const prop of userProperties) {
        if (!(prop in userRow)) {
            console.error(`Invalid user structure: Expected property ${prop}`);
            throw Error('DB_SELECT_FAILED');
        }
    }

    const user = userRow as User;

    if (!user) {
        console.error('Unable to find user');
        throw Error('DB_SELECT_FAILED');
    }

    return user;
};

/**
 * Retrieves the user ID associated with a session ID.
 *
 * @param {string} sessionId - The ID of the session.
 * @returns {Promise<string>} A Promise that resolves to the user ID.
 * @throws {Error} Throws an error if the session is invalid or the user cannot be found.
 */
const getUserId = async (sessionId: string): Promise<string> => {
    const validSession = await validateSession(sessionId);
    if (!validSession) {
        console.error('Invalid session');
        throw Error('AUTH_INVALID_SESSION');
    }

    const conn = db.connection();

    const query = `SELECT User.id as id
                   FROM auth_session JOIN User on auth_session.auth_user_id = User.auth_user_id 
                   WHERE auth_session.id = ?`;

    const { rows } = await conn.execute(query, [sessionId]);

    if (rows.length !== 1 || !rows[0].id) {
        console.error('Unable to find user');
        throw Error('DB_SELECT_FAILED');
    }
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
    const emailAlreadyExists = await emailExists(email);

    if (emailAlreadyExists) {
        throw Error('AUTH_DUPLICATE_EMAIL');
    }

    const conn = db.connection();

    const userId = await conn.transaction(async (tx) => {
        // Create auth_user
        const userId = v4();
        const query = `INSERT INTO auth_user (id, email) VALUES (?, ?);`;
        const userResult = await tx.execute(query, [userId, email]);

        if (userResult.insertId === null) {
            console.error('Unable to insert auth_user');
            throw Error('DB_INSERT_FAILED');
        }

        // Create auth_key
        const keyId = v4();
        const hashedPassword = await hashPassword(password);
        const keyQuery =
            'INSERT INTO auth_key (id, auth_user_id, hashed_password) VALUES (?, ?, ?);';
        const keyResult = await tx.execute(keyQuery, [keyId, userId, hashedPassword]);

        if (keyResult.insertId === null) {
            console.error('Unable to insert auth_key');
            throw new Error('DB_INSERT_FAILED');
        }

        // Create User Profile
        const userProfileQuery = 'INSERT INTO User (auth_user_id, name, email) VALUES (?, ?, ?);';
        const userProfileResult = await tx.execute(userProfileQuery, [userId, name, email]);

        if (userProfileResult.insertId === null) {
            console.error('Unable to insert User');
            throw Error('DB_INSERT_FAILED');
        }

        return userId;
    });

    return userId;
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

    if (authUserResult === undefined || authUserResult.rows.length !== 1) {
        console.error('AuthUser Not Found');
        throw Error('AUTH_INVALID_CREDENTIALS');
    }

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

    if (hashedPasswordResult === undefined || hashedPasswordResult.rows.length !== 1) {
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
 * @param {string} sessionId - The ID of the session to log out.
 * @returns {Promise<void>} A Promise that resolves when the logout is successful.
 * @throws {Error} Throws an error if the session is invalid or deletion fails.
 */
const logout = async (sessionId: string): Promise<void> => {
    const conn = db.connection();
    const selectQuery = 'SELECT id FROM auth_session WHERE id = ?';
    const selectResult = await conn.execute(selectQuery, [sessionId]);

    if (selectResult.rows.length !== 1) {
        console.error('Session not found');
        throw Error('AUTH_INVALID_SESSION');
    }

    const deleteSessionQuery = 'DELETE FROM auth_session WHERE id = ?';
    const result = await conn.execute(deleteSessionQuery, [sessionId]);

    if (result.rowsAffected === 0) {
        console.error('Unable to delete session');
        throw Error('DB_DELETE_FAILED');
    }

    return;
};

/**
 * Logs out all sessions associated with a user.
 *
 * @param {string} authUserId - The ID of the user to log out.
 * @returns {Promise<void>} A Promise that resolves when all sessions are successfully logged out.
 * @throws {Error} Throws an error if the user or sessions are not found, or deletion fails.
 */
const logoutAll = async (authUserId: string): Promise<void> => {
    const conn = db.connection();
    const findUserQuery = 'SELECT id FROM auth_user WHERE id = ?';
    const findUserResult = await conn.execute(findUserQuery, [authUserId]);
    if (findUserResult.rows.length !== 1) {
        console.error('User not found');
        throw Error('AUTH_INVALID_SESSION');
    }

    const findSessionsQuery = 'SELECT id FROM auth_session WHERE auth_user_id = ?';
    const findSessionsResult = await conn.execute(findSessionsQuery, [authUserId]);
    if (findSessionsResult.rows.length === 0) {
        console.error('No sessions found for User');
        throw Error('AUTH_INVALID_SESSION');
    }

    const deleteSessionsQuery = 'DELETE FROM auth_session WHERE auth_user_id = ?';
    const deleteSessionsResult = await conn.execute(deleteSessionsQuery, [authUserId]);
    if (deleteSessionsResult.rowsAffected === 0) {
        console.error('Unable to delete sessions');
        throw Error('DB_DELETE_FAILED');
    }

    return;
};

/**
 * Validates if a session ID is valid.
 *
 * @param {string} sessionId - The ID of the session to validate.
 * @returns {Promise<boolean>} A Promise that resolves to true if the session is valid, false otherwise.
 */
const validateSession = async (sessionId: string): Promise<boolean> => {
    const conn = db.connection();
    const query = 'SELECT id FROM auth_session WHERE id = ?';
    const result = await conn.execute(query, [sessionId]);
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
    const sessionId = cookies.get(COOKIE_NAME);
    if (sessionId === undefined) {
        return false;
    }
    return await validateSession(sessionId);
};

/**
 * Sets the session ID as a cookie.
 *
 * @param {string} sessionId - The session ID to set as a cookie.
 * @param {Cookies} cookies - The cookies object.
 * @returns {Cookies} The updated cookies object.
 */
const setSessionCookie = (sessionId: string, cookies: Cookies): Cookies => {
    cookies.set(COOKIE_NAME, sessionId, {
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
 * @param {string} sessionId - The session ID to validate and set as a cookie.
 * @param {Cookies} cookies - The cookies object.
 * @returns {Promise<Cookies>} A Promise that resolves to the updated cookies object.
 */
const validateAndSetCookie = async (sessionId: string, cookies: Cookies): Promise<Cookies> => {
    const isValid = await validateSession(sessionId);

    if (!isValid) {
        console.error('Invalid Session');
        return cookies;
    }

    return setSessionCookie(sessionId, cookies);
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

    // It is safe to extract the first row because it will not throw
    // an error if the email does not exist. We also check if the
    // id is undefined to ensure that the row is valid.

    const resultObj = result.rows[0] as { id: string | undefined };

    if (resultObj?.id !== undefined) {
        await conn.transaction(async (tx) => {
            await tx.execute('DELETE FROM auth_user WHERE id = ?', [resultObj.id]);
            await tx.execute('DELETE FROM auth_key WHERE auth_user_id = ?', [resultObj.id]);
            await tx.execute('DELETE FROM auth_session WHERE auth_user_id = ?', [resultObj.id]);
            await tx.execute('DELETE FROM User WHERE auth_user_id = ?', [resultObj.id]);
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
