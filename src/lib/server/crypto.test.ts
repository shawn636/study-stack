/**
 * @vitest-environment jsdom
 */

import { faker } from '@faker-js/faker';
import { hashPassword, comparePassword } from '$lib/server/crypto';

describe('crypto', () => {
    it('should be able to hash and compare a password', async () => {
        for (let i = 0; i < 20; i++) {
            const password = faker.internet.password();
            const hashedPassword = await hashPassword(password);
            const isMatch = await comparePassword(password, hashedPassword);
            expect(isMatch).toBe(true);
        }

        const password = faker.internet.password();
        const wrongPassword = 'wong_' + password;
        const hashedPassword = await hashPassword(password);
        const compareWrongHash = await comparePassword(wrongPassword, hashedPassword);
        expect(compareWrongHash).toBe(false);

        const compareCorrectHash = await comparePassword(hashedPassword, hashedPassword);
        expect(compareCorrectHash).toBe(false);
    }, 20000);
});
