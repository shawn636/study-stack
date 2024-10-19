import { DB, KeyType } from '../../src/lib/models/types/database.types';
import { Kysely, Transaction } from 'kysely';
import { RecordType, UserRole } from '../../src/lib/models/types/database.types';
import { init } from '@paralleldrive/cuid2';
import { PlanetScaleDialect } from 'kysely-planetscale';

import { DATABASE_URL } from './env';
import { hashPassword } from './crypto';

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
                email: email,
                id: authUserId,
                recordType: RecordType.TEST_RECORD
            })
            .executeTakeFirst();

        if (createAuthUserResult.numInsertedOrUpdatedRows !== 1n) {
            throw new Error('Failed to create AuthUser');
        }

        const createAuthKeyResult = await trx
            .insertInto('AuthKey')
            .values({
                authUserId: authUserId,
                id: authKeyId,
                recordType: RecordType.TEST_RECORD,
                type: KeyType.CREDENTIAL_HASH,
                value: keyValue
            })
            .executeTakeFirst();

        if (createAuthKeyResult.numInsertedOrUpdatedRows !== 1n) {
            throw new Error('Failed to create AuthKey');
        }

        const createUserResult = await trx
            .insertInto('User')
            .values({
                authUserId: authUserId,
                email: email,
                id: userId,
                name: name,
                recordType: RecordType.TEST_RECORD,
                role: UserRole.USER
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
        .select('AuthUser.id')
        .where('AuthUser.email', '=', email)
        .executeTakeFirst();

    if (authUserResult?.id === undefined) {
        return;
    }
    const authUserId = authUserResult.id;

    await db.transaction().execute(async (trx: Transaction<DB>) => {
        await trx.deleteFrom('User').where('User.authUserId', '=', authUserId).execute();
        await trx.deleteFrom('AuthKey').where('AuthKey.authUserId', '=', authUserId).execute();
        await trx.deleteFrom('AuthUser').where('AuthUser.id', '=', authUserId).execute();
    });
};

const deleteE2eTestUsers = async (): Promise<void> => {
    const authUsersResult = await db
        .selectFrom('AuthUser')
        .select('AuthUser.id')
        .where('AuthUser.recordType', '=', RecordType.TEST_RECORD)
        .execute();

    for (const authUser of authUsersResult) {
        await db.transaction().execute(async (trx: Transaction<DB>) => {
            await trx.deleteFrom('User').where('User.authUserId', '=', authUser.id).execute();
            await trx.deleteFrom('AuthKey').where('AuthKey.authUserId', '=', authUser.id).execute();
            await trx.deleteFrom('AuthUser').where('AuthUser.id', '=', authUser.id).execute();
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
