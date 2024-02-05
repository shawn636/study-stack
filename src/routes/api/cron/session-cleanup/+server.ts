import type { RequestHandler } from './$types';
import { db } from '$lib/server/database';

export const GET: RequestHandler = async () => {
    try {
        const conn = db.connection();

        const csrfFlush = await conn.execute(
            'DELETE FROM csrf_token WHERE CAST(expires AS DATETIME) <= CURRENT_TIMESTAMP();'
        );

        const authSessionFlush = await conn.execute(
            'DELETE FROM auth_session WHERE expires <= CURRENT_TIMESTAMP();'
        );

        const json = JSON.stringify({
            csrf_tokens_flushed: csrfFlush.rowsAffected,
            auth_sessions_flushed: authSessionFlush.rowsAffected
        });

        return new Response(json, {
            headers: {
                'content-type': 'application/json;charset=UTF-8'
            },
            status: 200
        });
    } catch (error) {
        console.error('An error occurred:', error);
        return new Response('Internal Server Error', {
            status: 500
        });
    }
};
