import { describe, it, expect } from 'vitest';
import {
    calculateTotalCost,
    calculateDiscountedTotal,
    getTotalPax,
    getStatusLabel,
    isBookingEditable,
    getAdvanceAmount,
} from '../utils/bookingHelpers';
import { IPaxRecord } from '../types/booking-form.types';

const mockPaxRecords: IPaxRecord[] = [
    {
        id: '_abc123',
        pax: 2,
        customer_details: [
            {
                name: 'John',
                contact_number: '9876543210',
                pick_up_point: 'Mumbai',
                meal_option: 'Veg',
                watersports_option: 'Scuba',
                package_cost: 5000,
                discounted_package_cost: 4000,
            },
            {
                name: 'Jane',
                contact_number: '9876543211',
                pick_up_point: 'Mumbai',
                meal_option: 'Non Veg',
                watersports_option: 'Scuba',
                package_cost: 5500,
                discounted_package_cost: 4400,
            },
        ],
    },
    {
        id: '_def456',
        pax: 1,
        customer_details: [
            {
                name: 'Bob',
                contact_number: '8765432109',
                pick_up_point: 'Pune',
                meal_option: 'Veg',
                watersports_option: 'Parasailing',
                package_cost: 3000,
                discounted_package_cost: 2400,
            },
        ],
    },
];

describe('calculateTotalCost', () => {
    it('should sum all package costs', () => {
        expect(calculateTotalCost(mockPaxRecords)).toBe(13500);
    });

    it('should return 0 for empty records', () => {
        expect(calculateTotalCost([])).toBe(0);
    });
});

describe('calculateDiscountedTotal', () => {
    it('should sum all discounted costs', () => {
        expect(calculateDiscountedTotal(mockPaxRecords)).toBe(10800);
    });

    it('should return 0 for empty records', () => {
        expect(calculateDiscountedTotal([])).toBe(0);
    });
});

describe('getTotalPax', () => {
    it('should count all customers across records', () => {
        expect(getTotalPax(mockPaxRecords)).toBe(3);
    });

    it('should return 0 for empty records', () => {
        expect(getTotalPax([])).toBe(0);
    });
});

describe('getStatusLabel', () => {
    it('should return correct label for each status', () => {
        expect(getStatusLabel('Confirmed')).toBe('Booking Confirmed');
        expect(getStatusLabel('Partially Confirmed')).toBe('Awaiting Full Payment');
        expect(getStatusLabel('Cancelled')).toBe('Booking Cancelled');
    });

    it('should return unknown for unexpected status', () => {
        expect(getStatusLabel('Something' as any)).toBe('Unknown Status');
    });
});

describe('isBookingEditable', () => {
    it('should return true for non-cancelled bookings', () => {
        expect(isBookingEditable('Confirmed')).toBe(true);
        expect(isBookingEditable('Partially Confirmed')).toBe(true);
    });

    it('should return false for cancelled bookings', () => {
        expect(isBookingEditable('Cancelled')).toBe(false);
    });
});

describe('getAdvanceAmount', () => {
    it('should calculate advance with default rate', () => {
        expect(getAdvanceAmount(3)).toBe(7500);
        expect(getAdvanceAmount(1)).toBe(2500);
    });

    it('should calculate advance with custom rate', () => {
        expect(getAdvanceAmount(2, 3000)).toBe(6000);
    });

    it('should return 0 for 0 pax', () => {
        expect(getAdvanceAmount(0)).toBe(0);
    });
});
