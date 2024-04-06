import { object, string } from 'yup';

const invalidEmailMessage = 'Oops! The email you entered is invalid.';
export const contactForm = object().shape({
    email: string()
        .email(invalidEmailMessage)
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, invalidEmailMessage)
        .required(invalidEmailMessage),
    message: string().required('Please enter a message to send.'),
    name: string().required('Please enter your name.')
});

export type ContactForm = {
    email: string;
    message: string;
    name: string;
};
