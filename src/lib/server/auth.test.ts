/**
 * @vitest-environment jsdom
 */
import { db } from '$lib/server/database';
import { auth } from '$lib/server/auth';

const accounts = [
    {
        email: 'jackmiller@gmail.com',
        name: 'Jack Miller',
        password: 'password',
        hashedPassword: '$2b$10$kAf6zKTdEIL.Xogd3xSizekP93x0w3yJry2e3cB2rB0FvCXEoHCeq'
    },
    {
        email: 'jordansmith@hotmail.com',
        name: 'Jordan Smith',
        password: 'password123',
        hashedPassword: '$2b$10$uY7dZXLZnkexrJdvvzoHJuuzsDPR0NuQUSspkpWbuJTyZH6Hw1eiu'
    },
    {
        email: 'testuser1@example.com',
        name: 'John Doe',
        password: 'P@$$w0Rd',
        hashedPassword: '$2b$10$zR0tq5WF/aI46blB3nTUIeJYKav5Dr7us7e3APdm6z1DXAQlsp7pe'
    },
    {
        email: 'sveltekit123@gmail.com',
        name: 'Jane Smith',
        password: 'testytesttest123',
        hashedPassword: '$2b$10$o8FwYlkExQif5OT9oeyuX.LRrm8YsUqvkFqhlUMJ1lTND2fEQ3AXC'
    },
    {
        email: 'superfakeemail@suspicious.net',
        name: 'Leroy Jenkinsonsmithers',
        password: 'IHonestlyHaveNoIdeaWhatImDoing',
        hashedPassword: '$2b$10$Gb6Lf7yunn/XrGThk3jtFevdApUjpUh9DOIN1cyxbgwNOWWckvj5S'
    },
    {
        email: 'cookiemonster@sesame.street',
        name: 'Monster, Cookie',
        password: 'COOKIE',
        hashedPassword: '$2b$10$lwqZ2xX1fGhEA9Khq2hBDumlNpLbCw4Hyy4SQDrBhbU5TuvdWMwxe'
    }
];

describe('auth', () => {
    beforeAll(async () => {
        const conn = db.connection();
        const deleteAuthUser = 'DELETE FROM auth_user WHERE email = ?';
        const deleteUser = 'DELETE FROM User WHERE email = ?';

        await Promise.all(
            accounts.map(async (account) => {
                await conn.execute(deleteAuthUser, [account.email]);
                await conn.execute(deleteUser, [account.email]);
            })
        );

        return async () => Promise.resolve();
    }, 20000);

    it('should create a valid user from createUser()', async () => {
        const conn = db.connection();

        const actIdx = 0;

        const userId = await auth.createUser(
            accounts[actIdx].email,
            accounts[actIdx].hashedPassword,
            accounts[actIdx].name
        );
        expect(userId).toBeDefined();
        expect(userId).toBeTruthy();

        const authUserResult = await conn.execute('SELECT * FROM auth_user WHERE email = ?', [
            accounts[actIdx].email
        ]);
        expect(authUserResult.rows.length).toBe(1);
        expect(authUserResult.rows[actIdx]).toBeTruthy();

        const userResult = await conn.execute('SELECT * FROM User WHERE email = ?', [
            accounts[actIdx].email
        ]);
        expect(userResult.rows.length).toBe(1);
        expect(userResult.rows[actIdx]).toBeTruthy();

        const authKeyResult = await conn.execute('SELECT * FROM auth_key WHERE auth_user_id = ?', [
            userId
        ]);
        expect(authKeyResult.rows.length).toBe(1);
        expect(authKeyResult.rows[actIdx]).toBeTruthy();
    });

    it('should fail to create a user from createUser() if they already have an account', async () => {
        const actIdx = 1;
        await auth.createUser(
            accounts[actIdx].email,
            accounts[actIdx].hashedPassword,
            accounts[actIdx].name
        );
        expect(() =>
            auth.createUser(
                accounts[actIdx].email,
                accounts[actIdx].hashedPassword,
                accounts[actIdx].name
            )
        ).rejects.toThrow('AUTH_DUPLICATE_EMAIL');
    });

    it('should successfully login a valid user from login()', async () => {
        const actIdx = 2;
        const userId = await auth.createUser(
            accounts[actIdx].email,
            accounts[actIdx].password,
            accounts[actIdx].name
        );
        expect(userId).toBeDefined();
        expect(userId).toBeTruthy();

        const session = await auth.login(accounts[actIdx].email, accounts[actIdx].password);
        expect(session).toBeDefined();
        expect(session).toBeTruthy();

        const allSessionsResults = await auth.getAllSessions(userId);
        expect(allSessionsResults).toBeDefined();
        expect(allSessionsResults).toBeTruthy();
        expect(allSessionsResults.length).toBe(1);

        const newSession = await auth.login(accounts[actIdx].email, accounts[actIdx].password);
        expect(newSession).toBeDefined();
        expect(newSession).toBeTruthy();
        expect(newSession).not.toBe(session);

        const allSessionsResults2 = await auth.getAllSessions(userId);
        expect(allSessionsResults2).toBeDefined();
        expect(allSessionsResults2).toBeTruthy();
        expect(allSessionsResults2.length).toBe(2);
    });

    it('should fail to login a user from login() if they do not have an account', async () => {
        const actIdx = 3;
        expect(() => auth.login(accounts[actIdx].email, accounts[actIdx].password)).rejects.toThrow(
            'AUTH_INVALID_CREDENTIALS'
        );
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
