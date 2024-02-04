import type { RequestHandler } from './$types';
import { db } from '$lib/server/database';

export const GET = (async () => {
    const conn = db.connection();

    const csrf_flush = await conn.execute(
        'DELETE FROM csrf_token WHERE CAST(expires AS DATETIME) <= CURRENT_TIMESTAMP();'
    );

    const auth_session_flush = await conn.execute(
        'DELETE FROM auth_session WHERE expires <= CURRENT_TIMESTAMP();'
    );

    const json = JSON.stringify({
        csrf_tokens_flushed: csrf_flush.rowsAffected,
        auth_sessions_flushed: auth_session_flush.rowsAffected
    });

    return new Response(json, {
        headers: {
            'content-type': 'application/json;charset=UTF-8'
        }
    });
}) satisfies RequestHandler;
