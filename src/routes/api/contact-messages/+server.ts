import type { ContactMessageCreateResponse } from '$lib/api/types/contact-messages';

import { CONTACT_FORM_TEMPLATE, type ContactFormEmail } from '$lib/models/emails/contact-form';
import { type ContactForm, contactForm } from '$lib/models/forms/contact';
import { type Recipient, sendEmailFromTemplate, type Sender } from '$lib/server/email';
import { handleErrors } from '$lib/server/error-handling';

import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
    try {
        const formData = await request.formData();

        const form: ContactForm = {
            email: formData.get('email') as string,
            message: formData.get('message') as string,
            name: formData.get('name') as string
        };

        await contactForm.validate(form, { abortEarly: true });

        const sender: Sender = { email: 'info@study-stack.com', name: 'Study Stack Team' };
        const recipient: Recipient = { email: 'admin@study-stack.com', name: 'Study Stack Team' };
        const now = new Date();
        const dateOptions: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            month: 'long',
            second: '2-digit',
            timeZone: 'America/Los_Angeles',
            timeZoneName: 'short',
            year: 'numeric'
        };

        const data: ContactFormEmail = {
            date: new Intl.DateTimeFormat('en-US', dateOptions).format(now),
            email: form.email,
            message: form.message,
            name: form.name
        };
        const subject = 'New Contact Form Submission';
        const response = await sendEmailFromTemplate(
            sender,
            recipient,
            subject,
            CONTACT_FORM_TEMPLATE,
            data
        );

        if (!response.ok) {
            throw new Error(`Failed to send email: ${JSON.stringify(response)}`);
        }

        const result: ContactMessageCreateResponse = {
            count: 1,
            data: null,
            object: 'ContactMessage',
            success: true
        };

        return new Response(JSON.stringify(result), {
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
