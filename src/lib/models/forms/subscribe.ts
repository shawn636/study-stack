import { object, string } from 'yup';

const invalidEmailMesasge = 'Oops! The email you entered is invalid.';
export const subscribeForm = object().shape({
    email: string()
        .email(invalidEmailMesasge)
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, invalidEmailMesasge)
        .required(invalidEmailMesasge)
});

export type SubscribeForm = {
    email: string;
};
