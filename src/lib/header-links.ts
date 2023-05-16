import type Link from '$lib/models/link';

export const headerLinks: Array<Link> = [
	{ name: 'Home', href: '/' },
	{ name: 'Find Courses', href: '/courses' },
	{ name: 'Create a Course', href: '/courses/create' },
	{ name: 'About', href: '/about' }
];
