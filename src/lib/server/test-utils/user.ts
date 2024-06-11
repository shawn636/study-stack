/**
 * Test Utils Module
 *
 * This module is part of the test utilities suite. Each module in this folder
 * must implement the `TestUtil` interface and provide a `cleanup` method. The
 * `cleanup` method is used to remove all mockups from the database for this module.
 *
 * IMPORTANT:
 * 1. Ensure that this module implements the `TestUtil` interface.
 * 2. Add a `cleanup` method to this module that performs necessary cleanup operations.
 * 3. Import this module in `cleanup.ts` and add it to the const array of modules.
 *
 * Example:
 *
 * import { TestUtil } from './types';
 *
 * const moduleA: TestUtil = {
 *   async cleanup() {
 *     // Implementation for moduleA cleanup
 *   },
 *   // other moduleA specific functions
 * };
 *
 * export default moduleA;
 *
 * Don't forget to add:
 * import moduleA from './moduleA';
 * const modules = [otherModule1, otherModule2, ... moduleA]; <-- Add moduleA here
 *
 * to `cleanup.ts`.
 */

import type { DB, User } from '$lib/models/types/database.types';
import type { TestUtil } from '$lib/models/types/test-util';
import type { Transaction } from 'kysely';

import { auth } from '$lib/server/auth';
import { cuid, db } from '$lib/server/database';

import { UNIT_TEST_EMAIL_DOMAIN } from './common';

/* Constants */
// const TEST_EMAIL_DOMAIN = 'uni.com';

interface UserTestUtil extends TestUtil {
    getUser(): Promise<User>;
    getUserWithCredentials(): Promise<UserWithCredentials>;
}

interface UserWithCredentials {
    email: string;
    password: string;
    user: User;
}

/* Module */
const module: UserTestUtil = {
    // Required Clenup Method
    async cleanup() {
        const authUsersResult = await db
            .selectFrom('AuthUser')
            .select('AuthUser.authUserId')
            .where('AuthUser.authUserEmail', 'like', `%${UNIT_TEST_EMAIL_DOMAIN}`)
            .execute();

        let usersDeleted = 0;

        for (const authUser of authUsersResult) {
            await db.transaction().execute(async (trx: Transaction<DB>) => {
                await trx
                    .deleteFrom('User')
                    .where('User.userAuthUserId', '=', authUser.authUserId)
                    .execute();
                await trx
                    .deleteFrom('AuthKey')
                    .where('AuthKey.authKeyAuthUserId', '=', authUser.authUserId)
                    .execute();
                await trx
                    .deleteFrom('AuthUser')
                    .where('AuthUser.authUserId', '=', authUser.authUserId)
                    .execute();
            });
            usersDeleted++;
        }

        console.log(`Cleaned up ${usersDeleted} users`);
    },

    async getUser(): Promise<User> {
        const { user } = await this.getUserWithCredentials();
        return user;
    },

    async getUserWithCredentials(): Promise<UserWithCredentials> {
        const id = cuid(); // Not the user id, just some unique identifier

        const email = `${id}@${UNIT_TEST_EMAIL_DOMAIN}`;
        const name = `Test User ${id}`;
        const password = cuid(); // Not the user password, just some unique identifier

        await auth.createUser(email, password, name);
        const sessionId = await auth.login(email, password);
        const user = await auth.getUser(sessionId);

        return {
            email,
            password,
            user
        };
    }
};

export default module;
