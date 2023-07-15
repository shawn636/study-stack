import type { RequestHandler } from './$types';

import { auth } from '$lib/server/auth';
import { csrf } from '$lib/server/csrf';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const POST = (async ({ cookies, request }) => {
    await csrf.validateCookies(cookies);
    const session_id = auth.getSession(cookies);

    if (!session_id) {
        throw error(401, 'You are not logged in.');
    }

    try {
        const [user_id, formData] = await Promise.all([
            auth.getUserId(session_id),
            request.formData()
        ]);

        const user_id_from_request = formData.get('user_id');
        const profile_photo = formData.get('profile_photo') as File;

        if (String(user_id) !== String(user_id_from_request)) {
            throw error(403, 'You are not authorized to update this user.');
        }

        console.log(`Photo Uploaded: ${profile_photo.name}`);

        // TODO: Step 1 - Upload profile_photo to cloudflare
        const new_photo_url = ''; // Get Back From Cloudflare

        // TODO: Step 2 - Update the user's photo_url
        // const query = 'UPDATE User SET photo_url = ? WHERE id = ?';
        const query = 'select 1 + 1 as result'; // Temporary query to prove working connection

        const conn = db.connection();
        const result = await conn.execute(query, [new_photo_url, user_id]);
        console.log(result.rows);
    } catch (e) {
        console.log(e);
        throw error(500, 'Unable to update due to server error.');
    }

    return new Response(null, {
        status: 200
    });
}) satisfies RequestHandler;
