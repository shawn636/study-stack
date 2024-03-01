import type User from '$lib/models/user';

import { COOKIE_NAME, auth } from '$lib/server/auth';

/**
 * @vitest-environment jsdom
 */
describe('/api/user', () => {
    // Define any necessary variables or constants for the tests

    it('should throw error if user is not logged in', async () => {
        // Call the PUT endpoint
        const response = await fetch('http://localhost:3000/api/user', {
            method: 'PUT'
        });

        expect(response.status).toBe(401);
    });

    it('should update the user with valid data', async () => {
        const email = 'johnny_testerson@testy.com';
        const pw = 'test';
        const name = 'Johnny Testerson';

        await auth.deleteUserIfExists('johnny_testerson@testy.com');
        await auth.createUser(email, pw, name);

        const sessionId = await auth.login('johnny_testerson@testy.com', 'test');

        const user: User = await auth.getUser(sessionId);

        const response = await fetch('http://localhost:3000/api/user', {
            body: JSON.stringify({ user }),
            headers: {
                'Content-Type': 'application/json',
                cookie: `${COOKIE_NAME}=${sessionId}`
            },
            method: 'PUT'
        });

        expect(response.status).toBe(200);

        user.country_code = '+1';
        user.area_code = '123';
        user.phone_number = '4567890';
        user.bio = 'I am a test user';

        const response2 = await fetch('http://localhost:3000/api/user', {
            body: JSON.stringify({ user }),
            headers: {
                'Content-Type': 'application/json',
                cookie: `${COOKIE_NAME}=${sessionId}`
            },
            method: 'PUT'
        });

        expect(response2.status).toBe(200);

        const updatedUser = await auth.getUser(sessionId);
        expect(updatedUser.country_code).toBe(user.country_code);
        expect(updatedUser.area_code).toBe(user.area_code);
        expect(updatedUser.phone_number).toBe(user.phone_number);
    });

    it('should throw error if a user tries to update another', async () => {
        const email1 = 'johnny_testerson@testy.com';
        const pw1 = 'test';
        const name1 = 'Johnny Testerson';

        const email2 = 'someone_else@gmail.com';
        const pw2 = 'test';
        const name2 = 'Someone Else';

        await Promise.all([auth.deleteUserIfExists(email1), auth.deleteUserIfExists(email2)]);

        await Promise.all([
            await auth.createUser(email1, pw1, name1),
            await auth.createUser(email2, pw2, name2)
        ]);

        const [user1SessionId, user2SessionId] = await Promise.all([
            await auth.login(email1, pw1),
            await auth.login(email2, pw2)
        ]);

        const user2: User = await auth.getUser(user2SessionId);

        const response = await fetch('http://localhost:3000/api/user', {
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
