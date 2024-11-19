import type { RequestHandler } from './$types';

import { POST as creatorSubscriptionPost } from './creator-subscriptions';
import { error } from '@sveltejs/kit';

export const POST = (async (req) => {
    const checkoutTarget = req.url.searchParams.get('checkoutTarget');

    switch (checkoutTarget) {
        case 'creator-subscription':
            return creatorSubscriptionPost(req);

        default:
            return error(400, 'Invalid Response - checkoutTarget not found');
    }
}) satisfies RequestHandler;
