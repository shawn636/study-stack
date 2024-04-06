import { object, string } from 'yup';

export const contactForm = object().shape({
    email: string()
        .email('Oops! The email you entered is invalid.')
        .matches(
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            'Oops! The email you entered is invalid.'
        )
        .required('Oops! The email you entered is invalid.'),
    message: string().required('Please enter a message to send.'),
    name: string().required('Please enter your name.')
});

export type ContactForm = {
    email: string;
    message: string;
    name: string;
};
