import type { Template } from '$lib/server/email';

/**
 * Type definition for the data structure of a contact form submission.
 *
 * This type should be used to ensure that the data being sent in a contact form
 * email matches the expected structure. It should include all fields that are
 * necessary for the corresponding email template.
 *
 * @field data - The date of the contact form submission.
 * @field email - The email address of the person who submitted the contact form.
 * @field message - The message content of the contact form submission.
 * @field name - The name of the person who submitted the contact form.
 */
export type ContactFormEmail = {
    date: string;
    email: string;
    message: string;
    name: string;
};

/**
 * Constant representing the email template for contact form submissions.
 *
 * This constant includes the metadata for the email template such as its
 * description, display name, and the template ID as used in the mailing service.
 * This object is intended to be passed to the email sending function to specify
 * which template should be used for sending the email.
 *
 * The template ID ('ynrw7gyvm3ng2k8e') is a unique identifier for the email template
 * and should match the corresponding template configured in the mailing service.
 *
 * @field description - A brief description of the email template's purpose.
 * @field name - The display name of the email template.
 * @field templateId - The unique identifier for the template in the mailing service.
 */
export const CONTACT_FORM_TEMPLATE: Template = {
    description: 'A contact form submission from the Equipped website',
    name: 'Contact Form Submission',
    templateId: 'ynrw7gyvm3ng2k8e'
};
