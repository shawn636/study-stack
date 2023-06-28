import { writable } from 'svelte/store';

export const sortByValues = ['Relevance', 'Highest Rated', 'Lowest Price'];
export const DisplayValues = ['Grid', 'List'];

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

export const sortBy = createSortByStore();
export const display = createDisplayStore();

export const search = writable('');
