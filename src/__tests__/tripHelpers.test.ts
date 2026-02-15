import { describe, it, expect } from 'vitest';
import {
    isTripBookable,
    getTripStatusColor,
    formatTripDateRange,
    getTripDurationDays,
    isTripUpcoming,
    getSeatsLabel,
} from '../utils/tripHelpers';

describe('isTripBookable', () => {
    it('should return true for scheduled trip with seats', () => {
        expect(isTripBookable('Scheduled', 10)).toBe(true);
    });

    it('should return false for scheduled trip with no seats', () => {
        expect(isTripBookable('Scheduled', 0)).toBe(false);
    });

    it('should return false for completed trip', () => {
        expect(isTripBookable('Completed', 10)).toBe(false);
    });

    it('should return false for cancelled trip', () => {
        expect(isTripBookable('Cancelled', 5)).toBe(false);
    });

    it('should return false for ongoing trip', () => {
        expect(isTripBookable('Ongoing', 5)).toBe(false);
    });
});

describe('getTripStatusColor', () => {
    it('should return green for Scheduled', () => {
        expect(getTripStatusColor('Scheduled')).toBe('green');
    });

    it('should return blue for Ongoing', () => {
        expect(getTripStatusColor('Ongoing')).toBe('blue');
    });

    it('should return gray for Completed', () => {
        expect(getTripStatusColor('Completed')).toBe('gray');
    });

    it('should return red for Cancelled', () => {
        expect(getTripStatusColor('Cancelled')).toBe('red');
    });

    it('should return gray for unknown status', () => {
        expect(getTripStatusColor('Unknown' as any)).toBe('gray');
    });
});

describe('formatTripDateRange', () => {
    it('should format date range', () => {
        const result = formatTripDateRange('2024-06-15', '2024-06-17');
        expect(result).toContain('Jun');
        expect(result).toContain('-');
    });

    it('should return empty for missing dates', () => {
        expect(formatTripDateRange('', '2024-06-17')).toBe('');
        expect(formatTripDateRange('2024-06-15', '')).toBe('');
    });

    it('should return empty for invalid dates', () => {
        expect(formatTripDateRange('bad', 'date')).toBe('');
    });
});

describe('getTripDurationDays', () => {
    it('should calculate duration correctly', () => {
        expect(getTripDurationDays('2024-06-15', '2024-06-17')).toBe(2);
    });

    it('should return 0 for same day', () => {
        expect(getTripDurationDays('2024-06-15', '2024-06-15')).toBe(0);
    });

    it('should return 0 for invalid dates', () => {
        expect(getTripDurationDays('invalid', '2024-06-17')).toBe(0);
    });

    it('should return 0 for reversed dates', () => {
        expect(getTripDurationDays('2024-06-17', '2024-06-15')).toBe(0);
    });
});

describe('isTripUpcoming', () => {
    it('should return true for future date', () => {
        expect(isTripUpcoming('2099-12-31')).toBe(true);
    });

    it('should return false for past date', () => {
        expect(isTripUpcoming('2020-01-01')).toBe(false);
    });

    it('should return false for empty string', () => {
        expect(isTripUpcoming('')).toBe(false);
    });

    it('should return false for invalid date', () => {
        expect(isTripUpcoming('not-a-date')).toBe(false);
    });
});

describe('getSeatsLabel', () => {
    it('should show fully booked for 0 seats', () => {
        expect(getSeatsLabel(0)).toBe('Fully Booked');
    });

    it('should show singular for 1 seat', () => {
        expect(getSeatsLabel(1)).toBe('1 seat left');
    });

    it('should show urgency for 2-5 seats', () => {
        expect(getSeatsLabel(3)).toBe('Only 3 seats left');
        expect(getSeatsLabel(5)).toBe('Only 5 seats left');
    });

    it('should show normal for more than 5 seats', () => {
        expect(getSeatsLabel(10)).toBe('10 seats available');
        expect(getSeatsLabel(50)).toBe('50 seats available');
    });

    it('should show fully booked for negative seats', () => {
        expect(getSeatsLabel(-1)).toBe('Fully Booked');
    });
});
