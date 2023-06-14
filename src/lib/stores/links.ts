import type Link from '$lib/models/link';
import { faHome, faCircleUser } from '@fortawesome/free-solid-svg-icons';

const headerLoggedOutLinks: Array<Link> = [
    { name: 'Home', href: '/', icon: undefined },
    { name: 'Find Courses', href: '/courses', icon: undefined },
    { name: 'Create a Course', href: '/courses/create', icon: undefined },
    { name: 'About', href: '/about', icon: undefined }
];

const headerLoggedInLinks: Array<Link> = [
    { name: 'Home', href: '/home', icon: undefined },
    { name: 'Find Courses', href: '/courses', icon: undefined },
    { name: 'Create a Course', href: '/courses/create', icon: undefined }
];

const sidebarLinks: Array<Link> = [
    { name: 'Home', href: '/home', icon: faHome },
    { name: 'My Account', href: '/account', icon: faCircleUser }
];

export const getHeaderLinks = (loggedIn: boolean) => {
    return loggedIn ? headerLoggedInLinks : headerLoggedOutLinks;
};

export const getSidebarLinks = () => sidebarLinks;
