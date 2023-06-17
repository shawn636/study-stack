import { writable } from 'svelte/store';

export const scrollPosition = writable(0);

export const pageHeight = writable(0);

export const scrollHandler = (e: Event) => {
    if (e.currentTarget instanceof HTMLElement) {
        const scrollTop = e.currentTarget.scrollTop;
        const scrollHeight = e.currentTarget.scrollHeight;
        const clientHeight = e.currentTarget.clientHeight;
        const totalPageHeight = scrollHeight - clientHeight;

        scrollPosition.set(scrollTop);
        pageHeight.set(totalPageHeight);
    } else {
        console.error('Unable to update scroll position or page height');
    }
};
