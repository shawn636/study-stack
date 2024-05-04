import type { User } from '$lib/models/types/database.types';

import { formatPhoneNumber } from '$lib/client/util';
import { writable } from 'svelte/store';
import { toast } from 'svelte-sonner';

export const phone = writable<string>('');

export const updatePhoneNumber = (
    event: { currentTarget: EventTarget & HTMLInputElement } & Event
) => {
    const inputNumber = event.currentTarget.value;
    const phoneNo = formatPhoneNumber(inputNumber);
    phone.set(phoneNo);
    event.currentTarget.value = phoneNo;
};

export const submitForm = async (user: User): Promise<User | null> => {
    const response = await fetch('/api/user', {
        body: JSON.stringify({ user }),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'PUT'
    });

    if (response.ok) {
        toast.success('Profile updated successfully');
        return user;
    } else {
        toast.error('Something went wrong. Please try again.');
        return null;
    }
};
