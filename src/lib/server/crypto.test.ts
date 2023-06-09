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
        const wrong_password = 'wong_' + password;
        const hashedPassword = await hashPassword(password);
        const compare_wrong_hash = await comparePassword(wrong_password, hashedPassword);
        expect(compare_wrong_hash).toBe(false);

        const compare_hash_hash = await comparePassword(hashedPassword, hashedPassword);
        expect(compare_hash_hash).toBe(false);
    }, 20000);
});
