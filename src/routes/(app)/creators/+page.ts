import { apiClientSingleton as client } from '$lib/api';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
    const lookupKeys = [
        'creators-free-monthly',
        'creators-free-yearly',
        'creators-pro-monthly',
        'creators-pro-yearly'
    ];
    const priceData = await client.prices.getPrices(lookupKeys, fetch);

    return { priceData };
}) satisfies PageLoad;
