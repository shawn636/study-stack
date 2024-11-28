import type { PriceData } from '$lib/api/types/prices';
import type { TestUtil } from '$lib/models/types/test-util';

import { stripe } from '$lib/server/stripe';

interface PriceTestData {
    prices: PriceData;
    lookupKeys: string[];
}
interface PriceTestUtil extends TestUtil {
    getPriceData(): Promise<PriceTestData>;
}

const module: PriceTestUtil = {
    async cleanup(): Promise<number> {
        return Promise.resolve(0);
    },

    async getPriceData(): Promise<PriceTestData> {
        const lookupKeys = ['test-112124-s01-monthly', 'test-112124-s01-yearly'];

        const prices = await stripe.prices.list({
            lookup_keys: lookupKeys
        });
        const priceData: PriceData = {};

        lookupKeys.forEach((key) => {
            const price = prices.data.find((p) => p.lookup_key === key);
            priceData[key] = price ? price : null;
        });

        const priceTestData: PriceTestData = {
            prices: priceData,
            lookupKeys: lookupKeys
        };

        return priceTestData;
    }
};

export default module;
