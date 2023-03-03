import { writable } from 'svelte/store';

function createSidebarStore() {
	const { subscribe, set, update } = writable(false);

	return {
		subscribe,
		set: () => set(false),
		toggle: () => update((val) => !val)
	};
}

export const sidebarStore = createSidebarStore();
