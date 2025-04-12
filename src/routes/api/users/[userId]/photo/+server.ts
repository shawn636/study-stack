import type { RequestHandler } from './$types';
import type { UserPhotoCreateResponse } from '$lib/api/types/users';

import { UnauthorizedError } from '$lib/server/error-handling/handled-errors';

import { auth } from '$lib/server/auth';
import { handleErrors } from '$lib/server/error-handling';

export const POST = (async ({ cookies, params }) => {
    await auth.validateApiSession(cookies, params.userId);
    const sessionId = auth.getSession(cookies);

    if (!sessionId) {
        throw new UnauthorizedError('You are not logged in.');
    }

    try {
        const responsePayload: UserPhotoCreateResponse = {
            count: 1,
            data: {
                imageId: '',
                imageUrl: ''
            },
            object: 'UserPhoto',
            success: true
        };

        return new Response(JSON.stringify(responsePayload), {
            headers: {
                'Content-Type': 'application/json'
            },
            status: 200
        });
    } catch (e) {
        return handleErrors(e);
    }
}) satisfies RequestHandler;
