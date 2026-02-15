import { describe, it, expect } from 'vitest';
import {
    isTripBookable,
    getTripStatusColor,
    getTripDurationDays,
    isTripUpcoming,
    getSeatsLabel,
} from '../utils/tripHelpers';

describe('isTripBookable - extra cases', () => {
    it('should return true for scheduled with many seats', () => {
        expect(isTripBookable('Scheduled', 50)).toBe(true);
    });

    it('should return false for completed even with seats', () => {
        expect(isTripBookable('Completed', 20)).toBe(false);
    });

    it('should return false for scheduled with exactly 0 seats', () => {
        expect(isTripBookable('Scheduled', 0)).toBe(false);
    });
});

describe('getTripStatusColor - extra cases', () => {
    it('should return green for Scheduled', () => {
        expect(getTripStatusColor('Scheduled')).toBe('green');
    });

    it('should return red for Cancelled', () => {
        expect(getTripStatusColor('Cancelled')).toBe('red');
    });
});

describe('getTripDurationDays - extra cases', () => {
    it('should handle multi-day trip', () => {
        expect(getTripDurationDays('2024-08-01', '2024-08-04')).toBe(3);
    });

    it('should handle single day', () => {
        expect(getTripDurationDays('2024-08-01', '2024-08-02')).toBe(1);
    });

    it('should return 0 for empty strings', () => {
        expect(getTripDurationDays('', '')).toBe(0);
    });
});

describe('isTripUpcoming - extra cases', () => {
    it('should return true for far future', () => {
        expect(isTripUpcoming('2080-06-15')).toBe(true);
    });

    it('should return false for old date', () => {
        expect(isTripUpcoming('2010-01-01')).toBe(false);
    });
});

describe('getSeatsLabel - extra cases', () => {
    it('should show urgency for 2 seats', () => {
        expect(getSeatsLabel(2)).toBe('Only 2 seats left');
    });

    it('should show normal for 20 seats', () => {
        expect(getSeatsLabel(20)).toBe('20 seats available');
    });

    it('should show fully booked for 0', () => {
        expect(getSeatsLabel(0)).toBe('Fully Booked');
    });
});
