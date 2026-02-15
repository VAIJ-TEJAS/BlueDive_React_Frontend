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

const singleRecord: IPaxRecord[] = [
    {
        id: '_test1',
        pax: 1,
        customer_details: [
            {
                name: 'Test User',
                contact_number: '9000000000',
                pick_up_point: 'Pune',
                meal_option: 'Veg',
                watersports_option: 'None',
                package_cost: 4000,
                discounted_package_cost: 3200,
            },
        ],
    },
];

describe('calculateTotalCost - extra cases', () => {
    it('should handle single record', () => {
        expect(calculateTotalCost(singleRecord)).toBe(4000);
    });

    it('should handle records with zero cost', () => {
        const zeroCost: IPaxRecord[] = [{
            id: '_z1',
            pax: 1,
            customer_details: [{
                name: 'Free',
                contact_number: '9000000001',
                pick_up_point: 'Mumbai',
                meal_option: 'Veg',
                watersports_option: 'None',
                package_cost: 0,
                discounted_package_cost: 0,
            }],
        }];
        expect(calculateTotalCost(zeroCost)).toBe(0);
    });
});

describe('calculateDiscountedTotal - extra cases', () => {
    it('should handle single record', () => {
        expect(calculateDiscountedTotal(singleRecord)).toBe(3200);
    });
});

describe('getTotalPax - extra cases', () => {
    it('should count single customer', () => {
        expect(getTotalPax(singleRecord)).toBe(1);
    });
});

describe('getStatusLabel - extra cases', () => {
    it('should handle Confirmed', () => {
        expect(getStatusLabel('Confirmed')).toBe('Booking Confirmed');
    });

    it('should handle Cancelled', () => {
        expect(getStatusLabel('Cancelled')).toBe('Booking Cancelled');
    });
});

describe('isBookingEditable - extra cases', () => {
    it('should be editable when Partially Confirmed', () => {
        expect(isBookingEditable('Partially Confirmed')).toBe(true);
    });
});

describe('getAdvanceAmount - extra cases', () => {
    it('should handle large pax count', () => {
        expect(getAdvanceAmount(10)).toBe(25000);
    });

    it('should handle custom advance per pax', () => {
        expect(getAdvanceAmount(5, 2000)).toBe(10000);
    });
});
