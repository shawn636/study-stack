import { db } from '$lib/server/database';
import { DatabaseError } from '$lib/server/error-handling/handled-errors';

/**
 * Deletes expired authentication sessions from the database.
 * @returns The number of deleted rows.
 * @throws {DatabaseError} If there is an error deleting the auth sessions.
 */
export const deleteAuthSessions = async () => {
    try {
        const result = await db
            .deleteFrom('AuthSession')
            .where('authSessionExpirationDate', '<=', new Date())
            .executeTakeFirst();

        return Number(result.numDeletedRows);
    } catch (error) {
        throw new DatabaseError(`Error deleting auth sessions: ${error}`);
    }
};
