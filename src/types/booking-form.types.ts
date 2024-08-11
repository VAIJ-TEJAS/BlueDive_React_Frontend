// Basic types for convenience
export type Status = 'Partially Confirmed' | 'Confirmed' | 'Cancelled';
export type PaymentStatus = 'Created' | 'Authorized' | 'Captured' | 'Failed' | 'Refunded';

// CustomerDetail interface
export interface ICustomerDetail {
    name: string;
    contact_number: string;
    pick_up_point: string;
    meal_option: string;
    watersports_option: string;
    package_cost: number;
    discounted_package_cost: number;
}

// PaxRecord interface
export interface IPaxRecord {
    id: string; 
    pax: number;
    customer_details: ICustomerDetail[];
}

// Payment interface
export interface IPayment {
    payment_id: string;
    order_id: string;
    signature: string;
    amount: number;
    status: PaymentStatus;
    payment_method: string;
}

// Booking interface with nested details
export interface IBookingDetails {
    user_id: number;
    trip_id: number;
    advance_payment: number;
    complete_payment: number;
    status: Status;
    scuba_included: boolean;
    pax_records: IPaxRecord[];
    payments: IPayment[];
}
