import { object, string } from 'yup';

export const loginForm = object().shape({
    email: string()
        .email('Oops! The email you entered is invalid.')
        .matches(
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            'Oops! The email you entered is invalid.'
        )
        .required('Please enter your email address.'),
    password: string().required('Please enter your password.')
});
