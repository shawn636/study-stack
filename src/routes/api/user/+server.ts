import type { User } from '@prisma/client';

import { auth } from '$lib/server/auth';
import { csrf } from '$lib/server/csrf';
import { prisma } from '$lib/server/database';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const PUT = (async ({ cookies, request }) => {
    await csrf.validateCookies(cookies);
    const sessionId = auth.getSession(cookies);

    if (!sessionId) {
        error(401, 'You are not logged in.');
    }

    const [userIdFromSession, requestData] = await Promise.all([
        await auth.getUserId(sessionId),
        await request.json()
    ]);

    const userFromRequest: User = requestData.user;
    const userIdFromRequest: number = requestData.user.id;

    if (Number(userIdFromSession) !== Number(userIdFromRequest)) {
        error(403, 'You are not authorized to update this user.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authUserId, id, organizationId, ...userFromRequestWithoutForeignKeys } =
        userFromRequest;
    try {
        await prisma.user.update({
            data: {
                ...userFromRequestWithoutForeignKeys
            },
            where: { id }
        });
    } catch (e) {
        console.error(e);

        error(500, 'Unable to update due to server error.');
    }

    return new Response(null, {
        status: 200
    });
}) satisfies RequestHandler;
