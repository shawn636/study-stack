import type { RequestHandler } from './$types';
import type User from '$lib/models/user';

import { auth } from '$lib/server/auth';
import { csrf } from '$lib/server/csrf';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const PUT = (async ({ cookies, request }) => {
    await csrf.validateCookies(cookies);
    const session_id = auth.getSession(cookies);

    if (!session_id) {
        throw error(401, 'You are not logged in.');
    }

    const [user_id, data] = await Promise.all([auth.getUserId(session_id), request.json()]);

    const user: User = data.user;

    const user_id_from_request = data.user.id;

    if (user_id !== user_id_from_request) {
        throw error(403, 'You are not authorized to update this user.');
    }

    try {
        const query =
            'UPDATE User SET email = ?, name = ?, country_code = ?, area_code = ?, phone_number = ?, bio = ?, city = ?, state = ? WHERE id = ?';

        const conn = db.connection();
        await conn.execute(query, [
            user.email,
            user.name,
            user.country_code,
            user.area_code,
            user.phone_number,
            user.bio,
            user.city,
            user.state,
            user_id
        ]);
    } catch (e) {
        console.log(e);

        throw error(500, 'Unable to update due to server error.');
    }

    return new Response(null, {
        status: 200
    });
}) satisfies RequestHandler;
