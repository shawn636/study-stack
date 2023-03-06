/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom';
import { sidebarStore } from '$lib/stores/sidebar';

describe('Tests for the sidebarStore', () => {
	afterEach(() => {
		sidebarStore.set();
	});

	test('Should initialize with a value of false', () => {
		let value: boolean | undefined;

		sidebarStore.subscribe((val) => {
			value = val;
		});

		expect(value).toBe(false);
	});

	test('resetting after toggling results in false', () => {
		let value: boolean | undefined;
		sidebarStore.subscribe((val) => {
			value = val;
		});

		sidebarStore.toggle();
		sidebarStore.set();
		expect(value).toBe(false);
	});

	test('toggling changes the store properly', () => {
		let value: boolean | undefined;

		sidebarStore.set();
		sidebarStore.subscribe((val) => {
			value = val;
		});

		sidebarStore.set();
		sidebarStore.toggle();
		expect(value).toBe(true);
		sidebarStore.toggle();
		expect(value).toBe(false);
	});
});
