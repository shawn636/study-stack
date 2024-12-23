import type { TestUtil } from '$lib/models/types/test-util';

import { faker } from '@faker-js/faker';
import { generateStripeSignature } from '$lib/server/stripe';

interface StripeWebhookTestData {
    eventPayload: string;
    signature: string;
}

interface StripeWebhookTestUtil extends TestUtil {
    getEventPayload(): StripeWebhookTestData;
}

const module: StripeWebhookTestUtil = {
    async cleanup(): Promise<number> {
        return Promise.resolve(0);
    },

    getEventPayload(): StripeWebhookTestData {
        const unixDate = Math.floor(Date.now() / 1000);
        const amt = faker.number.int({ min: 1000, max: 2000 });
        const generateId = (prefix: string, digits?: number) =>
            `${prefix}_${faker.string.alphanumeric(digits ?? 24)}`;

        const subscriptionId = generateId('sub');
        const subscriptionItemId = generateId('si', 14);
        const customerId = generateId('cus', 14);
        const priceId = generateId('price');
        const productId = generateId('prod', 14);
        const invoiceId = generateId('in');
        const requestId = generateId('req', 14);
        const idempotencyKey = faker.string.uuid();

        const eventPayload = JSON.stringify({
            id: generateId('evt'),
            object: 'event',
            api_version: '2024-10-28.acacia',
            created: unixDate,
            data: {
                object: {
                    id: subscriptionId,
                    object: 'subscription',
                    application: null,
                    application_fee_percent: null,
                    automatic_tax: {
                        disabled_reason: null,
                        enabled: false,
                        liability: null
                    },
                    billing_cycle_anchor: unixDate,
                    billing_cycle_anchor_config: null,
                    billing_thresholds: null,
                    cancel_at: null,
                    cancel_at_period_end: false,
                    canceled_at: null,
                    cancellation_details: {
                        comment: null,
                        feedback: null,
                        reason: null
                    },
                    collection_method: 'charge_automatically',
                    created: unixDate,
                    currency: 'usd',
                    current_period_end: unixDate + 2592000, // 30 days,
                    current_period_start: unixDate,
                    customer: customerId,
                    days_until_due: null,
                    default_payment_method: null,
                    default_source: null,
                    default_tax_rates: [],
                    description: null,
                    discount: null,
                    discounts: [],
                    ended_at: null,
                    invoice_settings: {
                        account_tax_ids: null,
                        issuer: {
                            type: 'self'
                        }
                    },
                    items: {
                        object: 'list',
                        data: [
                            {
                                id: subscriptionItemId,
                                object: 'subscription_item',
                                billing_thresholds: null,
                                created: unixDate,
                                discounts: [],
                                metadata: {},
                                plan: {
                                    id: priceId,
                                    object: 'plan',
                                    active: true,
                                    aggregate_usage: null,
                                    amount: amt,
                                    amount_decimal: `${amt}`,
                                    billing_scheme: 'per_unit',
                                    created: unixDate,
                                    currency: 'usd',
                                    interval: 'month',
                                    interval_count: 1,
                                    livemode: false,
                                    metadata: {},
                                    meter: null,
                                    nickname: null,
                                    product: productId,
                                    tiers_mode: null,
                                    transform_usage: null,
                                    trial_period_days: null,
                                    usage_type: 'licensed'
                                },
                                price: {
                                    id: priceId,
                                    object: 'price',
                                    active: true,
                                    billing_scheme: 'per_unit',
                                    created: unixDate,
                                    currency: 'usd',
                                    custom_unit_amount: null,
                                    livemode: false,
                                    lookup_key: null,
                                    metadata: {},
                                    nickname: null,
                                    product: productId,
                                    recurring: {
                                        aggregate_usage: null,
                                        interval: 'month',
                                        interval_count: 1,
                                        meter: null,
                                        trial_period_days: null,
                                        usage_type: 'licensed'
                                    },
                                    tax_behavior: 'unspecified',
                                    tiers_mode: null,
                                    transform_quantity: null,
                                    type: 'recurring',
                                    unit_amount: amt,
                                    unit_amount_decimal: `${amt}`
                                },
                                quantity: 1,
                                subscription: subscriptionId,
                                tax_rates: []
                            }
                        ],
                        has_more: false,
                        total_count: 1,
                        url: `/v1/subscription_items?subscription=${subscriptionId}`
                    },
                    latest_invoice: invoiceId,
                    livemode: false,
                    metadata: {},
                    next_pending_invoice_item_invoice: null,
                    on_behalf_of: null,
                    pause_collection: null,
                    payment_settings: {
                        payment_method_options: null,
                        payment_method_types: null,
                        save_default_payment_method: 'off'
                    },
                    pending_invoice_item_interval: null,
                    pending_setup_intent: null,
                    pending_update: null,
                    plan: {
                        id: priceId,
                        object: 'plan',
                        active: true,
                        aggregate_usage: null,
                        amount: amt,
                        amount_decimal: `${amt}`,
                        billing_scheme: 'per_unit',
                        created: unixDate,
                        currency: 'usd',
                        interval: 'month',
                        interval_count: 1,
                        livemode: false,
                        metadata: {},
                        meter: null,
                        nickname: null,
                        product: productId,
                        tiers_mode: null,
                        transform_usage: null,
                        trial_period_days: null,
                        usage_type: 'licensed'
                    },
                    quantity: 1,
                    schedule: null,
                    start_date: unixDate,
                    status: 'active',
                    test_clock: null,
                    transfer_data: null,
                    trial_end: null,
                    trial_settings: {
                        end_behavior: {
                            missing_payment_method: 'create_invoice'
                        }
                    },
                    trial_start: null
                }
            },
            livemode: false,
            pending_webhooks: 2,
            request: {
                id: requestId,
                idempotency_key: idempotencyKey
            },
            type: 'customer.subscription.created'
        });

        const signature = generateStripeSignature(eventPayload);

        const testData: StripeWebhookTestData = {
            eventPayload,
            signature
        };

        return testData;
    }
};

export default module;
