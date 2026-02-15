// API endpoint paths used across the application
export const API_ENDPOINTS = {
    // Packages
    PACKAGES_OVERVIEW: '/packages-overview/',
    PACKAGES_TRIPS: '/packages-trips/',

    // Auth
    SEND_OTP: '/send-otp/',
    VERIFY_OTP: '/verify-otp/',

    // User
    UPDATE_PROFILE: '/user/update_profile/',

    // Bookings
    BOOKINGS: '/bookings/',
    BOOKING_BY_ID: (id: number | string) => `/bookings/${id}/`,
    BOOKING_CONFIRM: (id: number | string) => `/bookings/${id}/confirm/`,

    // Payments
    PAYMENTS: '/payments/',
    BALANCE_PAYMENTS: '/balance-payments/',

    // Contact
    CONTACT_MESSAGES: '/contact-messages/',
} as const;

// HTTP status codes used in the app
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'bluedive-token',
    USER_DATA: 'bluedive-user-data',
} as const;

// Payment configuration
export const PAYMENT_CONFIG = {
    CURRENCY: 'INR',
    PROVIDER: 'Razorpay',
    COMPANY_NAME: 'BlueDive Konkan Wonders',
    THEME_COLOR: '#ef4444',
} as const;

// Country code for phone numbers
export const PHONE_CONFIG = {
    COUNTRY_CODE: '+91',
    OTP_LENGTH: 6,
} as const;
