import type { RequestHandler } from './$types';

import { auth } from '$lib/server/auth';
import { csrf } from '$lib/server/csrf';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const POST = (async ({ cookies, request }) => {
    await csrf.validateCookies(cookies);
    const sessionId = auth.getSession(cookies);

    if (!sessionId) {
        error(401, 'You are not logged in.');
    }

    try {
        const [userId, formData] = await Promise.all([
            auth.getUserId(sessionId),
            request.formData()
        ]);

        const userIdFromRequest = formData.get('user_id');
        const profilePhoto = formData.get('profile_photo') as File;

        if (String(userId) !== String(userIdFromRequest)) {
            error(403, 'You are not authorized to update this user.');
        }

        console.log(`Photo Uploaded: ${profilePhoto.name}`);

        // TODO: Step 1 - Upload profile_photo to cloudflare
        const newPhotoUrl = ''; // Get Back From Cloudflare

        // TODO: Step 2 - Update the user's photo_url
        // const query = 'UPDATE User SET photo_url = ? WHERE id = ?';
        const query = 'select 1 + 1 as result'; // Temporary query to prove working connection

        const conn = db.connection();
        const result = await conn.execute(query, [newPhotoUrl, userId]);
        console.log(result.rows);
    } catch (e) {
        console.log(e);
        error(500, 'Unable to update due to server error.');
    }

    return new Response(null, {
        status: 200
    });
}) satisfies RequestHandler;
