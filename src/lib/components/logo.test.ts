/**
 * @vitest-environment jsdom
 */

import Logo from '$lib/components/logo.svelte';
import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';

test('Test logo component', () => {
    const logo = render(Logo);
    expect(logo.getByText('Equipped')).toBeInTheDocument();
    expect(logo.getAllByText('Equipped').length).toBeGreaterThanOrEqual(1);
});
