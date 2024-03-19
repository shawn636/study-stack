import { prisma } from '$lib/server/database';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        const [csrfFlush, authSessionFlush] = await Promise.all([
            prisma.csrfToken.deleteMany({
                where: { expirationDate: { lte: new Date() } }
            }),
            prisma.authSession.deleteMany({
                where: { expirationDate: { lte: new Date() } }
            })
        ]);
        const json = JSON.stringify({
            authSessionsFlushed: authSessionFlush.count,
            csrfTokensFlushed: csrfFlush.count
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
