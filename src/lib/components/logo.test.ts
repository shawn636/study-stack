/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Logo from '$lib/components/logo.svelte';

test('Test logo component', () => {
	const logo = render(Logo);
	expect(logo.getByText('Equipped')).toBeInTheDocument();
	expect(logo.getAllByText('Equipped').length).toBeGreaterThanOrEqual(1);
});
