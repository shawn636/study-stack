import { db } from '$lib/server/database';
import { v4 as uuidv4 } from 'uuid';
import type { Cookies } from '@sveltejs/kit';

export const COOKIE_NAME = 'x-csrf-token';

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

const validateAndSetCookie = async (cookies: Cookies): Promise<Cookies> => {
    const token = cookies.get(COOKIE_NAME);
    const is_valid = await validateToken(token ?? '');

    if (!is_valid) {
        const token = await generateToken();
        if (token) {
            cookies = setCookie(token, cookies);
        } else {
            console.error('Unable to store csrf token in cookie');
        }
    }
    return cookies;
};

const validateCookies = async (cookies: Cookies): Promise<void> => {
    const token = cookies.get(COOKIE_NAME) as string;

    if (token === undefined || token == null || token === '') {
        console.error('No csrf token provided');
        throw Error('CSRF_INVALID_TOKEN');
    }
    const is_valid = await validateToken(token);

    if (!is_valid) {
        console.error('csrf token is invalid');
        throw Error('CSRF_INVALID_TOKEN');
    }
    return;
};

export const csrf = {
    validateToken,
    generateToken,
    setCookie,
    validateAndSetCookie,
    validateCookies
};
