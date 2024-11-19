import type { PriceData, PricesGetResponse } from '$lib/api/types/prices';
import type { RequestHandler } from './$types';

import { handleErrors } from '$lib/server/error-handling';
import { InvalidRequestError } from '$lib/server/error-handling/handled-errors';
import { stripe } from '$lib/server/stripe';

export const GET = (async ({ url }) => {
    try {
        const lookupKeys = url.searchParams.get('lookup_keys')?.split(',') || [];

        if (lookupKeys.length === 0) {
            throw new InvalidRequestError('Invalid request - missing query parameter lookup_keys');
        }

        const prices = await stripe.prices.list({
            lookup_keys: lookupKeys
        });

        const priceData: PriceData = {};

        lookupKeys.forEach((key) => {
            const price = prices.data.find((p) => p.lookup_key === key);

            priceData[key] = price ? price : null;
        });

        const result: PricesGetResponse = {
            count: lookupKeys.length,
            data: priceData,
            object: 'Prices',
            success: true
        };

        return new Response(JSON.stringify(result), {
            headers: {
                'content-type': 'application/json;charset=UTF-8'
            }
        });
    } catch (e) {
        return handleErrors(e);
    }
}) satisfies RequestHandler;
