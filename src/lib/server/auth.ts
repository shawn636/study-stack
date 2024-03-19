import type { Cookies } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { comparePassword, hashPassword } from '$lib/server/crypto';
import { prisma } from '$lib/server/database';
import { KeyType, type User } from '@prisma/client';

export const COOKIE_NAME = 'auth_session';

/**
 * Checks if an email already exists in the database.
 *
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>} A Promise that resolves to true if the email exists, false otherwise.
 */
const emailExists = async (email: string): Promise<boolean> => {
    const userCount = await prisma.authUser.count({
        where: {
            email: email
        }
    });

    return userCount > 0;
};

/**
 * Retrieves all session IDs associated with a user.
 *
 * @param {string} authUserId - The ID of the AuthUser.
 * @returns {Promise<string[]>} A Promise that resolves to an array of session IDs.
 */
const getAllSessions = async (authUserId: string): Promise<string[]> => {
    const sessions = await prisma.authSession.findMany({
        select: {
            id: true
        },
        where: { authUserId }
    });
    const sessionIds: string[] = sessions.map((session) => session.id);

    return sessionIds;
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

    const sessionResult = await prisma.authSession.findUniqueOrThrow({
        include: {
            authUser: {
                include: {
                    user: true
                }
            }
        },
        where: {
            id: sessionId
        }
    });

    if (!sessionResult.authUser.user) {
        console.error('Unable to find user');
        throw Error('DB_SELECT_FAILED');
    }

    return sessionResult.authUser.user;
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

    const sessionResult = await prisma.authSession.findUniqueOrThrow({
        include: {
            authUser: {
                include: {
                    user: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        },
        where: {
            id: sessionId
        }
    });

    if (!sessionResult?.authUser?.user?.id) {
        console.error('Unable to find user');
        throw Error('DB_SELECT_FAILED');
    }

    return sessionResult.authUser.user.id.toString();
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

    const keyValue = await hashPassword(password);

    const results = await prisma.authUser.create({
        data: {
            authKeys: { create: { keyType: KeyType.CREDENTIAL_HASH, keyValue } },
            email: email,
            user: { create: { email, name } }
        },
        include: { user: true }
    });

    if (!results.id) {
        throw Error('DB_INSERT_FAILED');
    }

    let authUserId = '';
    if (results.id !== undefined && results.id !== null) {
        authUserId = results.id;
    }

    if (authUserId === '') {
        throw Error('DB_INSERT_FAILED');
    }

    return authUserId;
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
    const loginResults = await prisma.authUser.findUnique({
        include: {
            authKeys: true
        },
        where: { email }
    });

    if (loginResults === undefined || loginResults?.id === undefined) {
        console.error('AuthUser Not Found');
        throw Error('AUTH_INVALID_CREDENTIALS');
    }

    if (loginResults.authKeys === undefined || loginResults.authKeys.length === 0) {
        console.error('AuthKey not found');
        throw Error('DB_SELECT_FAILED');
    }

    const credential = loginResults.authKeys.find((key) => key.keyType === KeyType.CREDENTIAL_HASH);

    if (credential === undefined || credential.keyValue === undefined) {
        console.error('AuthKey not found');
        throw Error('DB_SELECT_FAILED');
    }

    const isValid = await comparePassword(password, credential.keyValue);

    if (!isValid) {
        console.error('Invalid Password');
        throw Error('AUTH_INVALID_CREDENTIALS');
    }

    const currentDate = new Date();
    const expirationDate = new Date(currentDate);
    expirationDate.setDate(expirationDate.getDate() + 30);

    const session = await prisma.authSession.create({
        data: {
            authUserId: loginResults.id,
            expirationDate: expirationDate
        }
    });

    if (session === undefined || session.id === undefined) {
        console.error('Unable to create session');
        throw Error('DB_INSERT_FAILED');
    }

    return session.id;
};

/**
 * Logs out a user by deleting the session associated with the provided session ID.
 *
 * @param {string} sessionId - The ID of the session to log out.
 * @returns {Promise<void>} A Promise that resolves when the logout is successful.
 * @throws {Error} Throws an error if the session is invalid or deletion fails.
 */
const logout = async (sessionId: string): Promise<void> => {
    await prisma.authSession.delete({
        where: { id: sessionId }
    });

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
    await prisma.authSession.deleteMany({
        where: { authUserId: authUserId }
    });

    return;
};

/**
 * Validates if a session ID is valid.
 *
 * @param {string} sessionId - The ID of the session to validate.
 * @returns {Promise<boolean>} A Promise that resolves to true if the session is valid, false otherwise.
 */
const validateSession = async (sessionId: string): Promise<boolean> => {
    try {
        const session = await prisma.authSession.findUniqueOrThrow({
            where: { id: sessionId }
        });

        if (!session || !session.expirationDate) {
            return false;
        } else {
            return session.expirationDate > new Date();
        }
    } catch {
        return false;
    }
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
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'strict',
        secure: false
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
        maxAge: 0,
        path: '/',
        sameSite: 'strict',
        secure: false
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

    const authUser = await prisma.authUser.findUnique({ where: { email } });

    if (authUser === null || authUser === undefined) {
        return;
    }

    await prisma.authUser.delete({ where: { email } });

    return;
};

/**
 * Exposes the authentication-related functions as properties of the 'auth' object.
 */
export const auth = {
    createUser,
    deleteSessionCookie,
    deleteUserIfExists,
    emailExists,
    getAllSessions,
    getSession,
    getUser,
    getUserId,
    login,
    logout,
    logoutAll,
    setSessionCookie,
    validateAndSetCookie,
    validateCookies,
    validateSession
};
