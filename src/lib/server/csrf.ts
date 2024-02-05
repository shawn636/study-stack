import { db } from '$lib/server/database';
import { v4 as uuidv4 } from 'uuid';
import type { Cookies } from '@sveltejs/kit';

export const COOKIE_NAME = 'x-csrf-token';

/**
 * Validates if a CSRF token is valid and not expired.
 *
 * @param {string} token - The CSRF token to validate.
 * @returns {Promise<boolean>} A Promise that resolves to true if the token is valid, false otherwise.
 */
const validateToken = async (token: string) => {
    const conn = db.connection();
    try {
        const result = await conn.execute(
            'SELECT * FROM csrf_token WHERE token = ? AND expires > CURRENT_TIMESTAMP;',
            [token]
        );
        return result.rows.length > 0;
    } catch (e) {
        console.error('Something went wrong while validating token');
        return false;
    }
};

/**
 * Generates a new CSRF token and stores it in the database.
 *
 * @returns {Promise<string | null>} A Promise that resolves to the generated CSRF token, or null if insertion fails.
 */
const generateToken = async () => {
    const newToken: string = uuidv4();
    const conn = db.connection();
    try {
        await conn.execute(
            'INSERT INTO csrf_token (token, expires) VALUES (?, DATE_ADD(NOW(), INTERVAL 30 DAY)   );',
            [newToken]
        );
        return newToken;
    } catch (e) {
        console.log(e);
        console.error('Unable to insert token into database');
        return null;
    }
};

/**
 * Sets the CSRF token as a cookie.
 *
 * @param {string} token - The CSRF token to set as a cookie.
 * @param {Cookies} cookies - The cookies object.
 * @returns {Cookies} The updated cookies object.
 */
const setCookie = (token: string, cookies: Cookies): Cookies => {
    cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 0
    });
    return cookies;
};

/**
 * Validates the CSRF token stored in cookies and sets a new token if invalid or missing.
 *
 * @param {Cookies} cookies - The cookies object.
 * @returns {Promise<Cookies>} A Promise that resolves to the updated cookies object.
 */
const validateAndSetCookie = async (cookies: Cookies): Promise<Cookies> => {
    const token = cookies.get(COOKIE_NAME);
    const isValid = await validateToken(token ?? '');

    if (!isValid) {
        const token = await generateToken();
        if (token) {
            cookies = setCookie(token, cookies);
        } else {
            console.error('Unable to store csrf token in cookie');
        }
    }
    return cookies;
};

/**
 * Validates the CSRF token stored in cookies.
 *
 * @param {Cookies} cookies - The cookies object.
 * @returns {Promise<void>} A Promise that resolves when the token is valid.
 * @throws {Error} Throws an error if the token is missing or invalid.
 */
const validateCookies = async (cookies: Cookies): Promise<void> => {
    const token = cookies.get(COOKIE_NAME) as string;

    if (token === undefined || token == null || token === '') {
        console.error('No csrf token provided');
        throw Error('CSRF_INVALID_TOKEN');
    }
    const isValid = await validateToken(token);

    if (!isValid) {
        console.error('csrf token is invalid');
        throw Error('CSRF_INVALID_TOKEN');
    }
    return;
};

/**
 * Exposes the CSRF-related functions as properties of the 'csrf' object.
 */
export const csrf = {
    validateToken,
    generateToken,
    setCookie,
    validateAndSetCookie,
    validateCookies
};
