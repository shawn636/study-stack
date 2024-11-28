/**
 * @vitest-environment jsdom
 */

import { unitTestApiClient as client } from '$lib/server/test-utils/common';
import PriceTestUtil from '$lib/server/test-utils/price';

describe('prices', () => {
    it('returns a valid response with price data for all lookup keys when they exist.', async () => {
        const priceTestData = await PriceTestUtil.getPriceData();

        const response = await client.prices.getPrices(priceTestData.lookupKeys);

        expect(response.success).toBe(true);
        expect(response.count).toBe(priceTestData.lookupKeys.length);

        for (const lookupKey of priceTestData.lookupKeys) {
            expect(response.data[lookupKey]).toBeTruthy();
            expect(response.data[lookupKey]).toEqual(priceTestData.prices[lookupKey]);
        }
    });
});
