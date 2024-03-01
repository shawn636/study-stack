import type User from '$lib/models/user';

import { auth } from '$lib/server/auth';
import { csrf } from '$lib/server/csrf';
import { db } from '$lib/server/database';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const PUT = (async ({ cookies, request }) => {
    await csrf.validateCookies(cookies);
    const sessionId = auth.getSession(cookies);

    if (!sessionId) {
        error(401, 'You are not logged in.');
    }

    const [userId, data] = await Promise.all([auth.getUserId(sessionId), request.json()]);

    const user: User = data.user;

    const userIdFromRequest = data.user.id;

    if (userId !== userIdFromRequest) {
        error(403, 'You are not authorized to update this user.');
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
            userId
        ]);
    } catch (e) {
        console.log(e);

        error(500, 'Unable to update due to server error.');
    }

    return new Response(null, {
        status: 200
    });
}) satisfies RequestHandler;
