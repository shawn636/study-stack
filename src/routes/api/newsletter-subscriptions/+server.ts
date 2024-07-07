import type { NewsletterSubscriptionCreateResponse } from '$lib/api/types/newsletter-subscriptions';

import { type SubscriptionForm, subscriptionForm } from '$lib/models/forms/subscribe';
import { handleErrors } from '$lib/server/error-handling';

import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
    try {
        const data = await request.formData();
        const form: SubscriptionForm = {
            email: data.get('email') as string
        };

        await subscriptionForm.validate(form, { abortEarly: true });

        const responsePayload: NewsletterSubscriptionCreateResponse = {
            count: 1,
            data: null,
            object: 'NewsletterSubscription',
            success: true
        };

        console.warn(
            'WARNING: Received request for Newsletter Subscription but a newsletter service has not been configured yet.'
        );

        return new Response(JSON.stringify(responsePayload), {
            headers: {
                'cache-control': 'no-store',
                'content-type': 'application/json;charset=utf-8'
            },
            status: 201
        });
    } catch (e: unknown) {
        console.error(e);
        return handleErrors(e);
    }
}) satisfies RequestHandler;
