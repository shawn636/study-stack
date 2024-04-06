import { object, ref, string } from 'yup';

export const registrationForm = object().shape({
    email: string()
        .email('Oops! The email you entered is invalid.')
        .matches(
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            'Oops! The email you entered is invalid.'
        )
        .required('Please enter your email address.'),
    name: string().required('Please enter your name.'),
    password1: string()
        .min(8, 'Password should have at least 8 characters')
        .matches(/[a-z]/, 'Password should contain a lowercase letter')
        .matches(/[A-Z]/, 'Password should contain an uppercase letter')
        .matches(/[0-9]/, 'Password should contain a number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password should contain a special character')
        .required('Please enter your password.'),
    password2: string()
        .oneOf([ref('password1')], 'Passwords should match.')
        .required('Please confirm your password.')
});

export type RegistrationForm = {
    email: string;
    name: string;
    password1: string;
    password2: string;
};
