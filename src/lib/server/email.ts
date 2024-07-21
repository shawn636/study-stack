import { MAILERSEND_API_KEY } from '$env/static/private';

const apiBase = 'https://api.mailersend.com/v1';

export type Sender = {
    email: string;
    name?: string;
};

export type Recipient = {
    email: string;
    name: string;
};

export type Template = {
    description: string;
    name: string;
    templateId: string;
};

/**
 * Sends an email based on a specified template and data.
 *
 * @param sender - The sender's email and optional name.
 * @param recipient - The recipient's email and name.
 * @param subject - The subject line of the email.
 * @param template - The email template, including its ID, description, and name.
 * @param data - The data to be used in the template. It should match the structure required by the template.
 *
 * @returns The response from the MailerSend API.
 *
 * @example
 * ```
 * import { sendEmailFromTemplate, type Sender, type Recipient } from '$lib/server/email';
 * import { CONTACT_FORM_TEMPLATE, type ContactFormEmail } from '$lib/models/emails/contact-form';
 *
 * const sender: Sender = {
 *      email: 'noreply@example.com',
 *      name: 'Example Sender'
 * };
 * const recipient: Recipient = {
 *      email: 'user@example.com',
 *      name: 'Example User'
 * };
 * const subject = 'New Contact Form Submission';
 * const data: ContactFormEmail = {
 *   date: '2024-04-05',
 *   email: 'customer@example.com',
 *   message: 'Hello, this is a test message.',
 *   name: 'John Doe'
 * };
 *
 * sendEmailFromTemplate(sender, recipient, subject, CONTACT_FORM_TEMPLATE, data);
 * ```
 *
 * @warning It's up to the user to ensure that the the template and datatype for `data` match. This function does not perform any validation.
 */
export const sendEmailFromTemplate = async <T>(
    sender: Sender,
    recipient: Recipient,
    subject: string,
    template: Template,
    data: T
): Promise<Response> => {
    if (!MAILERSEND_API_KEY) {
        throw new Error('Missing MailerSend API key');
    }
    console.log(MAILERSEND_API_KEY);

    const body = JSON.stringify({
        from: sender,
        personalization: [
            {
                data: data,
                email: recipient.email
            }
        ],
        subject: subject,
        template_id: template.templateId,
        to: [recipient]
    });

    const response = await fetch(`${apiBase}/email`, {
        body,
        headers: {
            Authorization: `Bearer ${MAILERSEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        method: 'POST'
    });

    return response;
};
