import {
    ExternalServiceGenericError,
    InvalidRequestError
} from '$lib/server/error-handling/handled-errors';

import { handleErrors } from '$lib/server/error-handling';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/server/stripe';

export const POST = (async ({ request }) => {
    try {
        const origin = request.headers.get('origin');
        let lookupKey: string | null = null;

        try {
            const body = await request.json();
            if (!body.lookup_key) {
                throw new InvalidRequestError('Invalid request body - missing property lookup_key');
            }
            lookupKey = body.lookup_key;
        } catch (e) {
            if (e instanceof InvalidRequestError) {
                throw e;
            }
            throw new InvalidRequestError('Invalid request body');
        }

        const prices = await stripe.prices.list({
            lookup_keys: lookupKey ? [lookupKey] : undefined,
            expand: ['data.product']
        });

        if (!prices.data || !prices.data.length || prices.data.length === 0) {
            throw new ExternalServiceGenericError('Unable to retrieve price information');
        }

        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            ui_mode: 'embedded',
            line_items: [
                {
                    price: prices.data[0].id,
                    quantity: 1
                }
            ],
            mode: 'subscription',
            return_url: `${origin}/checkout/creators/success`
        });

        console.log(session);

        return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
            headers: {
                'content-type': 'application/json;charset=UTF-8'
            }
        });
    } catch (e) {
        return handleErrors(e);
    }
}) satisfies RequestHandler;
