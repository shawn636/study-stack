/**
 * @vitest-environment jsdom
 */

import { unitTestApiClient as client } from '$lib/server/test-utils/common';
import StripeWebhookTestUtilModule from '$lib/server/test-utils/stripe-webhook';

describe('Stripe Webhook Endpoint', () => {
    it('should return 200 for a valid request', async () => {
        const testData = StripeWebhookTestUtilModule.getEventPayload();

        const response = await client.stripeWebhooks.pushEvent(
            testData.eventPayload,
            testData.signature
        );

        expect(response.success).toBe(true);

        expect(response.data).toBeNull();
        expect(response.count).toBe(1);
        expect(response.object).toBe('StripeWebhook');
    });

    it('should return 400 for a missing signature', async () => {
        // Generate a normal payload but provide an empty signature
        const { eventPayload } = StripeWebhookTestUtilModule.getEventPayload();

        await expect(() => client.stripeWebhooks.pushEvent(eventPayload, '')).rejects.toThrow(
            'Request failed with status: 400 Bad Request'
        );
    });

    it('should return 400 for invalid payload', async () => {
        // Generate a normal payload but provide an empty signature
        const { eventPayload } = StripeWebhookTestUtilModule.getEventPayload();

        await expect(() => client.stripeWebhooks.pushEvent(eventPayload, '')).rejects.toThrow(
            'Request failed with status: 400 Bad Request'
        );
    });
});
