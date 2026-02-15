// Theme constants used across the application

export const COLORS = {
    PRIMARY: '#ef4444',
    PRIMARY_LIGHT: 'rgb(239 68 68 / 0.05)',
    SECONDARY: '#3b82f6',
    SUCCESS: '#22c55e',
    WARNING: '#eab308',
    DANGER: '#ef4444',
    INFO: '#06b6d4',
    DARK: '#1e293b',
    LIGHT: '#f8fafc',
    MUTED: '#94a3b8',
} as const;

export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    XXL: 1536,
} as const;

// Status color mapping for bookings
export const BOOKING_STATUS_COLORS: Record<string, string> = {
    'Confirmed': COLORS.SUCCESS,
    'Partially Confirmed': COLORS.WARNING,
    'Cancelled': COLORS.DANGER,
};

// Status color mapping for trips
export const TRIP_STATUS_COLORS: Record<string, string> = {
    'Scheduled': COLORS.SUCCESS,
    'Ongoing': COLORS.SECONDARY,
    'Completed': COLORS.MUTED,
    'Cancelled': COLORS.DANGER,
};

// Payment status color mapping
export const PAYMENT_STATUS_COLORS: Record<string, string> = {
    'Created': COLORS.INFO,
    'Authorized': COLORS.WARNING,
    'Captured': COLORS.SUCCESS,
    'Failed': COLORS.DANGER,
    'Refunded': COLORS.MUTED,
};

// Social media links
export const SOCIAL_LINKS = {
    FACEBOOK: 'https://www.facebook.com/Bluedivekonkanwonders.in?mibextid=LQQJ4d',
    INSTAGRAM: 'https://www.instagram.com/bluedive_konkan_wonders?igsh=MTJ3dmk4Z3JsenpzcA%3D%3D&utm_source=qr',
} as const;

// Company contact info
export const CONTACT_INFO = {
    PHONE: '+918668904446',
    PHONE_DISPLAY: '+91 866-890-4446',
    EMAIL: 'contact@bluedive.in',
    ADDRESS: 'Pune-411019, Maharashtra, India',
    COMPANY_NAME: 'BlueDive Konkan Wonders',
} as const;
