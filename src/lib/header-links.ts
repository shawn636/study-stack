import type Link from '$lib/models/link';

const loggedOutLinks: Array<Link> = [
	{ name: 'Home', href: '/' },
	{ name: 'Find Courses', href: '/courses' },
	{ name: 'Create a Course', href: '/courses/create' },
	{ name: 'About', href: '/about' }
];

const loggedInLinks: Array<Link> = [
	{ name: 'Dashboard', href: '/dashboard' },
	{ name: 'Find Courses', href: '/courses' },
	{ name: 'Create a Course', href: '/courses/create' }
];

export const getHeaderLinks = (loggedIn: boolean) => {
	return loggedIn ? loggedInLinks : loggedOutLinks;
};
