/**
 * @vitest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/svelte';
import Header from '$lib/sections/header.svelte';
import type { Subscriber } from 'svelte/store';

// setupTest.js for Vitest
vi.mock('$app/stores', async () => {
    const { readable, writable } = await import('svelte/store');

    const getStores = () => ({
        navigating: readable(null),
        page: readable({ url: new URL('http://localhost'), params: {} }),
        session: writable(null),
        updated: readable(false)
    });

    const page = {
        subscribe(fn: Subscriber<{ url: URL; params: unknown }>) {
            return getStores().page.subscribe(fn);
        }
    };

    const navigating = {
        subscribe(fn: Subscriber<null>) {
            return getStores().navigating.subscribe(fn);
        }
    };

    const session = {
        subscribe(fn: Subscriber<null>) {
            return getStores().session.subscribe(fn);
        }
    };

    const updated = {
        subscribe(fn: Subscriber<boolean>) {
            return getStores().updated.subscribe(fn);
        }
    };
    return {
        getStores,
        navigating,
        page,
        session,
        updated
    };
});

test('Header test', () => {
    const header = render(Header);
    expect(header.getAllByRole('button').length).toBe(1);

    const home = header.getAllByText('Home');
    expect(home.length).toBeGreaterThanOrEqual(1);

    const about = header.getAllByText('About');
    expect(about.length).toBeGreaterThanOrEqual(1);

    const findCourses = header.getAllByText('Find Courses');
    expect(findCourses.length).toBeGreaterThanOrEqual(1);

    const createCourses = header.getAllByText('Create a Course');
    expect(createCourses.length).toBeGreaterThanOrEqual(1);
});
