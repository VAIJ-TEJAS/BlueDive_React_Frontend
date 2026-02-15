// App route paths used across the application
export const ROUTES = {
    HOME: '/',
    TOUR_PACKAGES: '/tour-packages/',
    PACKAGE: '/package/:package_name',
    BOOKING: '/booking/:package_name',
    ABOUT: '/aboutus/',
    CONTACT: '/contact/',
    PRIVACY: '/privacy-policy/',
    TERMS: '/terms-of-service/',
    PARTNER: '/partner/',
    USER_PROFILE: '/user-profile/',
    USER_SETTINGS: '/user-setting/',
    USER_TOUR: '/user-tour/:id',
} as const;

// Helper to build dynamic routes
export const buildPackageRoute = (packageName: string): string => {
    return `/package/${encodeURIComponent(packageName)}`;
};

export const buildBookingRoute = (packageName: string): string => {
    return `/booking/${encodeURIComponent(packageName)}`;
};

export const buildUserTourRoute = (id: number | string): string => {
    return `/user-tour/${id}`;
};

// Navigation items used in navbar and footer
export interface NavItem {
    label: string;
    path: string;
    requiresAuth?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
    { label: 'Packages', path: ROUTES.TOUR_PACKAGES },
    { label: 'About Us', path: ROUTES.ABOUT },
    { label: 'Contact Us', path: ROUTES.CONTACT },
    { label: 'Become a Partner', path: ROUTES.PARTNER },
];

export const USER_NAV_ITEMS: NavItem[] = [
    { label: 'My Tours', path: ROUTES.USER_PROFILE, requiresAuth: true },
    { label: 'Become a Partner', path: ROUTES.PARTNER },
    { label: 'Settings', path: ROUTES.USER_SETTINGS, requiresAuth: true },
];
