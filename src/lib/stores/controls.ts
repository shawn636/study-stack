import { writable } from 'svelte/store';

/**
 * An array of valid values for sorting options.
 */
export const sortByValues = ['Relevance', 'Highest Rated', 'Lowest Price'];

/**
 * An array of valid values for display options.
 */
export const DisplayValues = ['Grid', 'List'];

/**
 * Creates a writable store for the sorting option.
 *
 * @returns {object} An object with 'subscribe', 'set', and 'update' functions for the sorting store.
 */
const createSortByStore = () => {
    const { subscribe, set, update } = writable('Most Popular');

    return {
        subscribe,
        set: (sortBy: string) => {
            if (sortByValues.includes(sortBy)) {
                set(sortBy);
            } else {
                throw new Error('Invalid sortBy value');
            }
        },
        update
    };
};

/**
 * Creates a writable store for the display option.
 *
 * @returns {object} An object with 'subscribe' and 'set' functions for the display store.
 */
const createDisplayStore = () => {
    const { subscribe, set } = writable('Grid');
    return {
        subscribe,
        set: (display: string) => {
            if (DisplayValues.includes(display)) {
                set(display);
            } else {
                throw new Error('Invalid display value');
            }
        }
    };
};

/**
 * The sorting store that manages the selected sorting option.
 */
export const sortBy = createSortByStore();

/**
 * The display store that manages the selected display option.
 */
export const display = createDisplayStore();

/**
 * A writable store for the search value.
 */
export const search = writable('');
