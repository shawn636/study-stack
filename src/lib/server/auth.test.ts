/**
 * @vitest-environment jsdom
 */
import type { Transaction } from '$lib/server/database';

import { auth } from '$lib/server/auth';
import { db } from '$lib/server/database';
import { KeyType } from '$lib/models/types/database.types';

const accounts = [
    {
        email: 'jackmiller@gmail.com',
        hashedPassword: '$2b$10$kAf6zKTdEIL.Xogd3xSizekP93x0w3yJry2e3cB2rB0FvCXEoHCeq',
        name: 'Jack Miller',
        password: 'password'
    },
    {
        email: 'jordansmith@hotmail.com',
        hashedPassword: '$2b$10$uY7dZXLZnkexrJdvvzoHJuuzsDPR0NuQUSspkpWbuJTyZH6Hw1eiu',
        name: 'Jordan Smith',
        password: 'password123'
    },
    {
        email: 'testuser1@example.com',
        hashedPassword: '$2b$10$zR0tq5WF/aI46blB3nTUIeJYKav5Dr7us7e3APdm6z1DXAQlsp7pe',
        name: 'John Doe',
        password: 'P@$$w0Rd'
    },
    {
        email: 'sveltekit123@gmail.com',
        hashedPassword: '$2b$10$o8FwYlkExQif5OT9oeyuX.LRrm8YsUqvkFqhlUMJ1lTND2fEQ3AXC',
        name: 'Jane Smith',
        password: 'testytesttest123'
    },
    {
        email: 'superfakeemail@suspicious.net',
        hashedPassword: '$2b$10$Gb6Lf7yunn/XrGThk3jtFevdApUjpUh9DOIN1cyxbgwNOWWckvj5S',
        name: 'Leroy Jenkinsonsmithers',
        password: 'IHonestlyHaveNoIdeaWhatImDoing'
    },
    {
        email: 'cookiemonster@sesame.street',
        hashedPassword: '$2b$10$lwqZ2xX1fGhEA9Khq2hBDumlNpLbCw4Hyy4SQDrBhbU5TuvdWMwxe',
        name: 'Monster, Cookie',
        password: 'COOKIE'
    }
];

describe('auth', () => {
    beforeAll(async () => {
        const promises = accounts.map(async (account) => {
            const authUser = await db
                .selectFrom('AuthUser')
                .select('AuthUser.id')
                .where('AuthUser.email', '=', account.email)
                .executeTakeFirst();

            if (authUser) {
                await db.transaction().execute(async (trx: Transaction) => {
                    await trx
                        .deleteFrom('User')
                        .where('User.authUserId', '=', authUser.id)
                        .execute();
                    await trx
                        .deleteFrom('AuthKey')
                        .where('AuthKey.authUserId', '=', authUser.id)
                        .execute();
                    await trx
                        .deleteFrom('AuthSession')
                        .where('AuthSession.authUserId', '=', authUser.id)
                        .execute();
                    await trx
                        .deleteFrom('AuthUser')
                        .where('AuthUser.id', '=', authUser.id)
                        .execute();
                });
            }
        });
        await Promise.all(promises);

        return async () => Promise.resolve();
    }, 20000);

    it('should create a valid user from createUser()', async () => {
        const actIdx = 0;

        const userId = await auth.createUser(
            accounts[actIdx].email,
            accounts[actIdx].hashedPassword,
            accounts[actIdx].name
        );
        expect(userId).toBeDefined();
        expect(userId).toBeTruthy();

        const results = await db
            .selectFrom('AuthUser')
            .innerJoin('AuthKey', 'AuthUser.id', 'AuthKey.authUserId')
            .innerJoin('User', 'AuthUser.id', 'User.authUserId')
            .select(['AuthUser.id as authUserId', 'User.id as userId', 'AuthKey.id as authKeyId'])
            .where('AuthUser.email', '=', accounts[actIdx].email)
            .where('AuthKey.type', '=', KeyType.CREDENTIAL_HASH)
            .execute();

        expect(results).toBeTruthy();

        expect(results.length).toBe(1);
        const result = results[0];

        expect(result.authUserId).toBeTruthy();
        expect(result.userId).toBeTruthy();
        expect(result.authKeyId).toBeTruthy();
    });

    it('should fail to create a user from createUser() if they already have an account', async () => {
        const actIdx = 1;
        await auth.createUser(
            accounts[actIdx].email,
            accounts[actIdx].hashedPassword,
            accounts[actIdx].name
        );
        await expect(() =>
            auth.createUser(
                accounts[actIdx].email,
                accounts[actIdx].hashedPassword,
                accounts[actIdx].name
            )
        ).rejects.toThrow('AUTH_DUPLICATE_EMAIL');
    });

    it('should successfully login a valid user from login()', async () => {
        const actIdx = 2;
        const authUserId = await auth.createUser(
            accounts[actIdx].email,
            accounts[actIdx].password,
            accounts[actIdx].name
        );
        expect(authUserId).toBeDefined();
        expect(authUserId).toBeTruthy();

        const session = await auth.login(accounts[actIdx].email, accounts[actIdx].password);
        expect(session).toBeDefined();
        expect(session).toBeTruthy();

        const allSessionsResults = await auth.getAllSessions(authUserId);
        expect(allSessionsResults).toBeDefined();
        expect(allSessionsResults).toBeTruthy();
        expect(allSessionsResults.length).toBe(1);

        const newSession = await auth.login(accounts[actIdx].email, accounts[actIdx].password);
        expect(newSession).toBeDefined();
        expect(newSession).toBeTruthy();
        expect(newSession).not.toBe(session);

        const allSessionsResults2 = await auth.getAllSessions(authUserId);
        expect(allSessionsResults2).toBeDefined();
        expect(allSessionsResults2).toBeTruthy();
        expect(allSessionsResults2.length).toBe(2);
    });

    it('should fail to login a user from login() if they do not have an account', async () => {
        const actIdx = 3;
        await expect(() =>
            auth.login(accounts[actIdx].email, accounts[actIdx].password)
        ).rejects.toThrow('AUTH_INVALID_CREDENTIALS');
    });

    it('should be able to remove one or multiple sessions and validate existing sessions', async () => {
        const actIdx = 4;
        const userId = await auth.createUser(
            accounts[actIdx].email,
            accounts[actIdx].password,
            accounts[actIdx].name
        );
        expect(userId).toBeDefined();

        const sessionId1 = await auth.login(accounts[actIdx].email, accounts[actIdx].password);
        expect(sessionId1).toBeDefined();

        let allSessionsResults = await auth.getAllSessions(userId);
        expect(allSessionsResults).toBeTruthy();
        expect(allSessionsResults.length).toBe(1);
        expect(allSessionsResults.includes(sessionId1)).toBe(true);

        let sessionId1IsValid = await auth.validateSession(sessionId1);
        expect(sessionId1IsValid).toBe(true);

        const sessionId2 = await auth.login(accounts[actIdx].email, accounts[actIdx].password);
        expect(sessionId2).toBeDefined();

        allSessionsResults = await auth.getAllSessions(userId);
        expect(allSessionsResults).toBeTruthy();
        expect(allSessionsResults.length).toBe(2);
        expect(
            [sessionId1, sessionId2].every((session_id) => allSessionsResults.includes(session_id))
        ).toBe(true);

        let sessionId2IsValid = await auth.validateSession(sessionId2);
        expect(sessionId2IsValid).toBe(true);

        const sessionId3 = await auth.login(accounts[actIdx].email, accounts[actIdx].password);
        expect(sessionId3).toBeDefined();

        allSessionsResults = await auth.getAllSessions(userId);
        expect(allSessionsResults).toBeTruthy();
        expect(allSessionsResults.length).toBe(3);
        expect(
            [sessionId1, sessionId2, sessionId3].every((sessionId) =>
                allSessionsResults.includes(sessionId)
            )
        ).toBe(true);

        let sessionId3IsValid = await auth.validateSession(sessionId3);
        expect(sessionId3IsValid).toBe(true);

        await auth.logout(sessionId2);

        sessionId2IsValid = await auth.validateSession(sessionId2);
        expect(sessionId2IsValid).toBe(false);

        allSessionsResults = await auth.getAllSessions(userId);
        expect(allSessionsResults).toBeTruthy();
        expect(allSessionsResults.length).toBe(2);
        expect(
            [sessionId1, sessionId3].every((sessionId) => allSessionsResults.includes(sessionId))
        ).toBe(true);

        await auth.logoutAll(userId);
        allSessionsResults = await auth.getAllSessions(userId);
        expect(allSessionsResults).toBeTruthy();
        expect(allSessionsResults.length).toBe(0);

        sessionId1IsValid = await auth.validateSession(sessionId1);
        expect(sessionId1IsValid).toBe(false);
        sessionId3IsValid = await auth.validateSession(sessionId3);
        expect(sessionId3IsValid).toBe(false);
    });
});
