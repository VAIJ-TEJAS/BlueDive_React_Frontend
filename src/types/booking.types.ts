// Trip interface should be defined based on your Django Trip model
export interface ITrip {
    id: number;
    package: {
        name: string;
    };
}

// Booking interface
export interface IBooking {
    id: number;
    user: {
        username: string;
    };
    trip: ITrip;
    advance_payment: number;
    complete_payment: number;
    booking_date: string; // ISO 8601 format string
    status: 'Partially Confirmed' | 'Confirmed' | 'Cancelled';
    scuba_included: boolean;
}

// PaxRecord interface
export interface IPaxRecord {
    id: number;
    booking: IBooking;
    pax: number;
}

// CustomerDetail interface
export interface ICustomerDetail {
    id: number;
    pax_record: IPaxRecord;
    name: string;
    contact_number: string;
    pick_up_point: string;
    meal_option: string;
    watersports_option: string;
    package_cost: number;
    discounted_package_cost: number;
}

// Payment interface
export interface IPayment {
    id: number;
    booking: IBooking;
    payment_id: string;
    order_id: string;
    signature: string;
    amount: number;
    status: 'Created' | 'Authorized' | 'Captured' | 'Failed' | 'Refunded';
    payment_method: string;
    created_at: string; // ISO 8601 format string
}
