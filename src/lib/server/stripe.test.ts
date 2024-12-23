import crypto from 'crypto';
import { generateStripeSignature } from '$lib/server/stripe';
import { STRIPE_SANDBOX_WEBHOOK_SECRET } from '$env/static/private';

describe('generateStripeSignature', () => {
    const testPayload = JSON.stringify({
        id: 'evt_test_id',
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_id', amount: 1000 } }
    });

    it('generates a valid signature in the expected format', () => {
        const signature = generateStripeSignature(testPayload);

        // Check the format
        expect(signature).toMatch(/^t=\d+,v1=[a-f0-9]{64}$/); // Matches t=<timestamp>,v1=<hex-hash>
    });

    it('generates consistent signatures for the same input', () => {
        const timestamp = 1734908123; // Fixed timestamp for deterministic testing
        const signedPayload = `${timestamp}.${testPayload}`;
        const expectedSignature = crypto
            .createHmac('sha256', STRIPE_SANDBOX_WEBHOOK_SECRET)
            .update(signedPayload)
            .digest('hex');

        const signature = `t=${timestamp},v1=${expectedSignature}`;

        // Mock Date.now() for the test
        vi.spyOn(Date, 'now').mockReturnValue(timestamp * 1000);
        const result = generateStripeSignature(testPayload);
        expect(result).toBe(signature);

        // Restore the original Date.now()
        vi.restoreAllMocks();
    });

    it('produces different signatures for different payloads', () => {
        const payload1 = JSON.stringify({ id: 'evt_1', data: { amount: 1000 } });
        const payload2 = JSON.stringify({ id: 'evt_2', data: { amount: 2000 } });

        const signature1 = generateStripeSignature(payload1);
        const signature2 = generateStripeSignature(payload2);

        expect(signature1).not.toBe(signature2);
    });

    it('produces different signatures for different timestamps', () => {
        const timestamp1 = 1734908123;
        const timestamp2 = 1734909134;

        // Mock Date.now() for the first timestamp
        vi.spyOn(Date, 'now').mockReturnValue(timestamp1 * 1000);
        const signature1 = generateStripeSignature(testPayload);

        // Mock Date.now() for the second timestamp
        vi.spyOn(Date, 'now').mockReturnValue(timestamp2 * 1000);
        const signature2 = generateStripeSignature(testPayload);

        // Restore the original Date.now()
        vi.restoreAllMocks();

        expect(signature1).not.toBe(signature2);
    });

    it('handles empty payload gracefully', () => {
        const emptyPayload = '';
        const timestamp = 1734908123;
        vi.spyOn(Date, 'now').mockReturnValue(timestamp * 1000);
        const signature = generateStripeSignature(emptyPayload);
        expect(signature).toMatch(/^t=\d+,v1=[a-f0-9]{64}$/); // Check format still holds
    });
});
