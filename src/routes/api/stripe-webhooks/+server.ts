import type { RequestHandler } from './$types';
import type { StripeWebhooksPostResponse } from '$lib/api/types/stripe-webhooks';

import { stripe, WEBHOOK_SECRET } from '$lib/server/stripe';
import { handleErrors } from '$lib/server/error-handling';
import { InvalidRequestError } from '$lib/server/error-handling/handled-errors';
import { processEvent } from './util';

export const POST = (async ({ request }) => {
    try {
        const signature = request.headers.get('stripe-signature') ?? '';
        const body = await request.text();

        let success = false;

        if (!signature || !body) {
            throw new InvalidRequestError('Invalid Request: Missing body or signature');
        }

        try {
            const event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
            processEvent(event);
            success = true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            throw new InvalidRequestError(`Webhook Error: ${errorMessage}`);
        }

        const response: StripeWebhooksPostResponse = {
            count: success ? 1 : 0,
            data: null,
            object: 'StripeWebhook',
            success: success
        };

        return new Response(JSON.stringify(response), {
            headers: {
                'cache-control': 'no-store',
                'content-type': 'application/json;charset=UTF-8'
            },
            status: 200
        });
    } catch (e: unknown) {
        return handleErrors(e);
    }
}) satisfies RequestHandler;
