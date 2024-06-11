/**
 * @vitest-environment jsdom
 */
import { COOKIE_NAME as AUTH_COOKIE_NAME, auth } from '$lib/server/auth';
import { COOKIE_NAME as CSRF_COOKIE_NAME, csrf } from '$lib/server/csrf';
import { db, sql } from '$lib/server/database';
import { faker } from '@faker-js/faker';

interface Account {
    email: string;
    name: string;
    password: string;
}

const accounts: Account[] = new Array(5).fill(null).map(() => {
    return {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password()
    } as Account;
});

describe('login', () => {
    beforeAll(async () => {
        const promises = accounts.map(async (account) => {
            await auth.deleteUserIfExists(account.email);
            await auth.createUser(account.email, account.password, account.name);
        });
        await Promise.all(promises);
    });
    afterAll(async () => {
        const promises = accounts.map(async (account) => {
            await auth.deleteUserIfExists(account.email);
        });
        await Promise.all(promises);
    });
    it('should be able to communicate with database', async () => {
        expect(db).toBeTruthy();

        const result = await sql<{ solution: number }>`SELECT 1 + 1 as solution`.execute(db);

        expect(result.rows.length).toBe(1);
        expect(Number(result.rows[0].solution)).toBe(2);
    });

    it('should successfully login', async () => {
        for (const account of accounts) {
            const formData = new FormData();
            formData.append('email', account.email);
            formData.append('password', account.password);

            const csrfToken = await csrf.generateToken();
            const headers = new Headers();
            headers.append(CSRF_COOKIE_NAME, csrfToken ?? '');

            const res = await fetch('http://localhost:3004/auth/login', {
                body: formData,
                headers,
                method: 'POST'
            });

            expect(res.status).toBe(200);

            const cookies = res.headers.get('set-cookie');
            const splitCookies = cookies?.split(/[,;|]/).map((cookie) => cookie.trim()) ?? [];
            const authCookie = splitCookies.find((cookie) => cookie.startsWith(AUTH_COOKIE_NAME));
            const cookieValue = authCookie?.split('=').at(-1) ?? '';

            expect(cookieValue).toBeTruthy();

            const session = await db
                .selectFrom('AuthSession')
                .selectAll()
                .where('AuthSession.authSessionId', '=', cookieValue)
                .executeTakeFirst();

            expect(session).toBeTruthy();
            expect(session?.authSessionId).toBeTruthy();
            expect(session?.authSessionId).toBe(cookieValue);
        }
    }, 20000);
});
