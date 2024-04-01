import { init } from '@paralleldrive/cuid2';
import { Kysely, Transaction } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';

import { DB, KeyType } from '../../src/lib/models/database.types';
import { hashPassword } from './crypto';
import { DATABASE_URL } from './env';

const cuid = init({
    length: 30
});

export const db = new Kysely<DB>({
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
                id: authUserId
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
                keyType: KeyType.CREDENTIAL_HASH,
                keyValue: keyValue
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
                role: 'user'
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
        .select('id')
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

export const auth = {
    createUser,
    deleteUserIfExists
};
