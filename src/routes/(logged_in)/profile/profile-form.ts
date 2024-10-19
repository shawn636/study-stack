import type { User } from '$lib/models/types/database.types';

import { apiClientSingleton as client } from '$lib/api';
import { formatPhoneNumber } from '$lib/client/util';
import { toast } from 'svelte-sonner';
import { writable } from 'svelte/store';

export const phone = writable<string>('');

export const updatePhoneNumber = (
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
) => {
    const inputNumber = event.currentTarget.value;
    const phoneNo = formatPhoneNumber(inputNumber);
    phone.set(phoneNo);
    event.currentTarget.value = phoneNo;
};

export const submitForm = async (user: User): Promise<User | null> => {
    const response = await client.users.update(user.id, user);

    if (response.success) {
        toast.success('Profile updated successfully');
        return response.data;
    } else {
        toast.error('Something went wrong. Please try again.');
        return null;
    }
};
