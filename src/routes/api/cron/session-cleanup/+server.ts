import { db } from '$lib/server/database';

import type { RequestHandler } from './$types';

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
            auth_sessions_flushed: authSessionFlush.rowsAffected,
            csrf_tokens_flushed: csrfFlush.rowsAffected
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
