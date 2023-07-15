import { writable } from 'svelte/store';

/**
 * A Svelte writable store for the current scroll position.
 */
export const scrollPosition = writable(0);

/**
 * A Svelte writable store for the total page height.
 */
export const pageHeight = writable(0);

/**
 * Updates the scroll position and page height based on the provided event.
 *
 * @param {Event} e - The scroll event.
 */
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
