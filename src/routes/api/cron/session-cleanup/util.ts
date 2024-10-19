import { DatabaseError } from '$lib/server/error-handling/handled-errors';
import { db } from '$lib/server/database';

/**
 * Deletes expired authentication sessions from the database.
 * @returns The number of deleted rows.
 * @throws {DatabaseError} If there is an error deleting the auth sessions.
 */
export const deleteAuthSessions = async () => {
    try {
        const result = await db
            .deleteFrom('AuthSession')
            .where('expirationDate', '<=', new Date())
            .executeTakeFirst();

        return Number(result.numDeletedRows);
    } catch (error) {
        throw new DatabaseError(`Error deleting auth sessions: ${error}`);
    }
};
