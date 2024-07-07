import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const POST = (async ({ cookies, request }) => {
    const sessionId = auth.getSession(cookies);

    if (!sessionId) {
        error(401, 'You are not logged in.');
    }

    try {
        const [userId, formData] = await Promise.all([
            auth.getUserId(sessionId),
            request.formData()
        ]);

        const userIdFromRequest = formData.get('userId');

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const profilePhoto = formData.get('profilePhoto') as File;

        if (String(userId) !== String(userIdFromRequest)) {
            error(403, 'You are not authorized to update this user.');
        }

        // TODO: Step 1 - Upload profile_photo to cloudflare
        // const newPhotoUrl = ''; // Get Back From Cloudflare

        // TODO: Step 2 - Update the user's photo_url in the database
    } catch (e) {
        error(500, 'Unable to update due to server error.');
    }

    return new Response(null, {
        status: 200
    });
}) satisfies RequestHandler;
