import { init } from '@paralleldrive/cuid2';
import { Kysely, Transaction } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';

import { RecordType, UserRole } from '../../src/lib/models/types/database.types';
import { DB, KeyType } from '../../src/lib/models/types/database.types';
import { hashPassword } from './crypto';
import { DATABASE_URL } from './env';

const cuid = init({
    length: 30
});

const db = new Kysely<DB>({
    dialect: new PlanetScaleDialect({
        url: DATABASE_URL
    })
});

const createUser = async (email: string, password: string, name: string): Promise<string> => {
    const keyValue = await hashPassword(password);

    const authUserId = cuid();
    const userId = cuid();
    const authKeyId = cuid();

    await db.transaction().execute(async (trx: Transaction<DB>) => {
        const createAuthUserResult = await trx
            .insertInto('AuthUser')
            .values({
                authUserEmail: email,
                authUserId: authUserId,
                authUserRecordType: RecordType.TEST_RECORD
            })
            .executeTakeFirst();

        if (createAuthUserResult.numInsertedOrUpdatedRows !== 1n) {
            throw new Error('Failed to create AuthUser');
        }

        const createAuthKeyResult = await trx
            .insertInto('AuthKey')
            .values({
                authKeyAuthUserId: authUserId,
                authKeyId: authKeyId,
                authKeyRecordType: RecordType.TEST_RECORD,
                authKeyType: KeyType.CREDENTIAL_HASH,
                authKeyValue: keyValue
            })
            .executeTakeFirst();

        if (createAuthKeyResult.numInsertedOrUpdatedRows !== 1n) {
            throw new Error('Failed to create AuthKey');
        }

        const createUserResult = await trx
            .insertInto('User')
            .values({
                userAuthUserId: authUserId,
                userEmail: email,
                userId: userId,
                userName: name,
                userRecordType: RecordType.TEST_RECORD,
                userRole: UserRole.USER
            })
            .executeTakeFirst();

        if (createUserResult.numInsertedOrUpdatedRows !== 1n) {
            throw new Error('Failed to create User');
        }
    });

    return userId;
};

const deleteUserIfExists = async (email: string): Promise<void> => {
    const authUserResult = await db
        .selectFrom('AuthUser')
        .select('AuthUser.authUserId')
        .where('AuthUser.authUserEmail', '=', email)
        .executeTakeFirst();

    if (authUserResult?.authUserId === undefined) {
        return;
    }
    const authUserId = authUserResult.authUserId;

    await db.transaction().execute(async (trx: Transaction<DB>) => {
        await trx.deleteFrom('User').where('User.userAuthUserId', '=', authUserId).execute();
        await trx
            .deleteFrom('AuthKey')
            .where('AuthKey.authKeyAuthUserId', '=', authUserId)
            .execute();
        await trx.deleteFrom('AuthUser').where('AuthUser.authUserId', '=', authUserId).execute();
    });
};

const deleteE2eTestUsers = async (): Promise<void> => {
    const authUsersResult = await db
        .selectFrom('AuthUser')
        .select('AuthUser.authUserId')
        .where('AuthUser.authUserRecordType', '=', RecordType.TEST_RECORD)
        .execute();

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
    }
};

export const auth = {
    createUser,
    cuid,
    db,
    deleteE2eTestUsers,
    deleteUserIfExists
};
