/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom';
import Logo from '$lib/components/logo.svelte';
import { render } from '@testing-library/svelte';

test('logo component', () => {
    const logo = render(Logo);
    expect(logo.getByText('Equipped')).toBeInTheDocument();
    expect(logo.getAllByText('Equipped').length).toBeGreaterThanOrEqual(1);
});
