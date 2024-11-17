import type Link from '$lib/models/types/link';

import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

const headerLoggedOutLinks: Array<Link> = [
    { href: '/courses', icon: undefined, name: 'Find Courses' },
    { href: '/creators', icon: undefined, name: 'Become a creator' },
    { href: '/about', icon: undefined, name: 'About' }
];

const headerLoggedInLinks: Array<Link> = [
    { href: '/courses', icon: undefined, name: 'Find Courses' },
    { href: '/creators', icon: undefined, name: 'Become a creator' },
    { href: '/about', icon: undefined, name: 'About' }
];

const sidebarLinks: Array<Link> = [{ href: '/profile', icon: faCircleUser, name: 'Profile' }];

export const getHeaderLinks = (loggedIn: boolean) => {
    return loggedIn ? headerLoggedInLinks : headerLoggedOutLinks;
};

export const getSidebarLinks = () => sidebarLinks;
