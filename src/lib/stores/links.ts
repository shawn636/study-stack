import type Link from '$lib/models/link';

import { faCircleUser, faHome } from '@fortawesome/free-solid-svg-icons';

const headerLoggedOutLinks: Array<Link> = [
    { href: '/', icon: undefined, name: 'Home' },
    { href: '/courses', icon: undefined, name: 'Find Courses' },
    { href: '/courses/create', icon: undefined, name: 'Create a Course' },
    { href: '/about', icon: undefined, name: 'About' }
];

const headerLoggedInLinks: Array<Link> = [
    { href: '/home', icon: undefined, name: 'Home' },
    { href: '/courses', icon: undefined, name: 'Find Courses' },
    { href: '/courses/create', icon: undefined, name: 'Create a Course' }
];

const sidebarLinks: Array<Link> = [
    { href: '/home', icon: faHome, name: 'Home' },
    { href: '/account', icon: faCircleUser, name: 'My Account' }
];

export const getHeaderLinks = (loggedIn: boolean) => {
    return loggedIn ? headerLoggedInLinks : headerLoggedOutLinks;
};

export const getSidebarLinks = () => sidebarLinks;
