// Generic API response wrapper
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

// Paginated response from the backend
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// Generic API error shape
export interface ApiError {
    status: number;
    message: string;
    errors?: Record<string, string[]>;
}

// OTP request/response types
export interface SendOtpRequest {
    phone: string;
}

export interface SendOtpResponse {
    message: string;
}

export interface VerifyOtpRequest {
    phone: string;
    otp: string;
}

export interface VerifyOtpResponse {
    user: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
    };
    token: string;
}

// Profile update types
export interface UpdateProfileRequest {
    first_name: string;
    last_name: string;
}

export interface UpdateProfileResponse {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
}

// Payment order types
export interface CreatePaymentRequest {
    trip_id: number;
    selected_payment_option: string;
    pax_records: PaymentPaxRecord[];
}

export interface PaymentPaxRecord {
    pax: number;
    customer_details: PaymentCustomerDetail[];
}

export interface PaymentCustomerDetail {
    name: string;
    contact_number: string;
    pick_up_point: string;
    meal_option: string;
    meal_option_id: number;
    watersports_option: string;
    package_cost: number;
    discounted_package_cost: number;
}

export interface CreatePaymentResponse {
    order_id: string;
    razorpay_key_id: string;
    amount: number;
    balance_amount: number;
}

// Balance payment types
export interface BalancePaymentRequest {
    booking_id: number;
}

export interface BalancePaymentResponse {
    order_id: string;
    razorpay_key_id: string;
    amount: number;
}

// Booking confirmation types
export interface BookingConfirmPayment {
    payment_id: string;
    order_id: string;
    signature: string;
    amount: number;
    payment_method: string;
}

export interface BookingConfirmRequest {
    payment: BookingConfirmPayment;
}

export interface BookingConfirmResponse {
    id: number;
    status: string;
    message?: string;
}

// Razorpay callback response
export interface RazorpayCallbackResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

// Contact form types
export interface ContactMessageRequest {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface ContactMessageResponse {
    id: number;
    message: string;
}

// Package overview (list view)
export interface PackageOverview {
    id: number;
    name: string;
    duration?: string;
    description?: string;
    cover_image?: string;
    display_price?: number | null;
    display_discount_percentage?: number | null;
}

// Loading state helper type
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Common form state
export interface FormState<T> {
    data: T;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
}
