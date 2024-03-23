import type { User } from '@prisma/client';

import { COOKIE_NAME, auth } from '$lib/server/auth';

/**
 * @vitest-environment jsdom
 */
describe('/api/user', () => {
    interface TestAccount {
        email: string;
        name: string;
        password: string;
    }

    const testAccounts: TestAccount[] = [
        {
            email: 'johnny_testerson@testy.com',
            name: 'Johnny Testerson',
            password: 'test'
        },
        {
            email: 'someone_else@gmail.com',
            name: 'Someone Else',
            password: 'test'
        }
    ];

    beforeAll(async () => {
        await Promise.all(testAccounts.map((account) => auth.deleteUserIfExists(account.email)));
        await Promise.all(
            testAccounts.map((account) =>
                auth.createUser(account.email, account.password, account.name)
            )
        );
    });

    afterAll(async () => {
        await Promise.all(testAccounts.map((account) => auth.deleteUserIfExists(account.email)));
    });

    it('should throw error if user is not logged in', async () => {
        // Call the PUT endpoint
        const response = await fetch('http://localhost:3004/api/user', {
            method: 'PUT'
        });

        expect(response.status).toBe(401);
    });

    it('should update the user with valid data', async () => {
        const sessionId = await auth.login(testAccounts[0].email, testAccounts[0].password);
        const user: User = await auth.getUser(sessionId);

        const response = await fetch('http://localhost:3004/api/user', {
            body: JSON.stringify({ user }),
            headers: {
                'Content-Type': 'application/json',
                cookie: `${COOKIE_NAME}=${sessionId}`
            },
            method: 'PUT'
        });

        expect(response.status).toBe(200);

        user.countryCode = '+1';
        user.areaCode = '123';
        user.phoneNumber = '4567890';
        user.bio = 'I am a test user';

        const response2 = await fetch('http://localhost:3004/api/user', {
            body: JSON.stringify({ user }),
            headers: {
                'Content-Type': 'application/json',
                cookie: `${COOKIE_NAME}=${sessionId}`
            },
            method: 'PUT'
        });

        expect(response2.status).toBe(200);

        const updatedUser = await auth.getUser(sessionId);
        expect(updatedUser.countryCode).toBe(user.countryCode);
        expect(updatedUser.areaCode).toBe(user.areaCode);
        expect(updatedUser.phoneNumber).toBe(user.phoneNumber);
    });

    it('should throw error if a user tries to update another', async () => {
        const [user1SessionId, user2SessionId] = await Promise.all([
            await auth.login(testAccounts[0].email, testAccounts[0].password),
            await auth.login(testAccounts[1].email, testAccounts[1].password)
        ]);

        const user2: User = await auth.getUser(user2SessionId);

        const response = await fetch('http://localhost:3004/api/user', {
            body: JSON.stringify({ user: user2 }),
            headers: {
                'Content-Type': 'application/json',
                cookie: `${COOKIE_NAME}=${user1SessionId}`
            },
            method: 'PUT'
        });

        expect(response.status).toBe(403);
    });
});
