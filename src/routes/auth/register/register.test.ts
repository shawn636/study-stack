/**
 * @vitest-environment jsdom
 */
import { db } from '$lib/server/database';
import { faker } from '@faker-js/faker';
import { auth, COOKIE_NAME as AUTH_COOKIE_NAME } from '$lib/server/auth';
import { csrf, COOKIE_NAME as CSRF_COOKIE_NAME } from '$lib/server/csrf';
import { isUUID } from '$lib/server/crypto';

interface Account {
    email: string;
    password: string;
    name: string;
}

const accounts: Account[] = new Array(5).fill(null).map(() => {
    return {
        email: faker.internet.email(),
        password: faker.internet.password() + 'Aa1!',
        name: faker.person.fullName()
    } as Account;
});

describe('register', () => {
    beforeAll(async () => {
        for (const account of accounts) {
            await auth.deleteUserIfExists(account.email);
        }
    });
    afterAll(async () => {
        for (const account of accounts) {
            await auth.deleteUserIfExists(account.email);
        }
    });
    it('should be able to communicate with database', async () => {
        expect(db).toBeDefined();
        expect(db).toBeTruthy();

        const conn = db.connection();
        expect(conn).toBeDefined();
        expect(conn).toBeTruthy();
    });

    it('should successfully create account and create cookie', async () => {
        for (const account of accounts) {
            const form_data = new FormData();
            form_data.append('email', account.email);
            form_data.append('password1', account.password);
            form_data.append('password2', account.password);
            form_data.append('name', account.name);

            const csrf_token = await csrf.generateToken();
            const headers = new Headers();
            headers.append(CSRF_COOKIE_NAME, csrf_token ?? '');

            const res = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                body: form_data,
                headers
            });

            expect(res.status).toBe(200);

            const cookies = res.headers.get('set-cookie');
            const split_cookies = cookies?.split(/[,;|]/).map((cookie) => cookie.trim()) ?? [];
            const auth_cookie = split_cookies.find((cookie) => cookie.startsWith(AUTH_COOKIE_NAME));
            const cookie_value = auth_cookie?.split('=').at(-1) ?? '';

            expect(cookie_value).toBeDefined();
            expect(isUUID(cookie_value)).toBe(true);
        }
    }, 20000);
});
