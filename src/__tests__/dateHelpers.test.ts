import { describe, it, expect } from 'vitest';
import { formatDate, isDateInPast, daysBetween } from '../utils/dateHelpers';

describe('formatDate', () => {
    it('should format a date string', () => {
        const result = formatDate('2024-01-15');
        expect(result).toContain('Jan');
        expect(result).toContain('2024');
    });

    it('should format a Date object', () => {
        const result = formatDate(new Date(2024, 5, 20));
        expect(result).toContain('Jun');
        expect(result).toContain('2024');
    });

    it('should return empty string for invalid date', () => {
        expect(formatDate('not-a-date')).toBe('');
    });
});

describe('isDateInPast', () => {
    it('should return true for past dates', () => {
        expect(isDateInPast('2020-01-01')).toBe(true);
        expect(isDateInPast('2000-06-15')).toBe(true);
    });

    it('should return false for future dates', () => {
        expect(isDateInPast('2099-12-31')).toBe(false);
    });

    it('should return false for invalid dates', () => {
        expect(isDateInPast('invalid')).toBe(false);
    });
});

describe('daysBetween', () => {
    it('should calculate days between two dates', () => {
        expect(daysBetween('2024-01-01', '2024-01-10')).toBe(9);
        expect(daysBetween('2024-01-01', '2024-02-01')).toBe(31);
    });

    it('should return negative for reversed dates', () => {
        expect(daysBetween('2024-01-10', '2024-01-01')).toBe(-9);
    });

    it('should return 0 for same date', () => {
        expect(daysBetween('2024-01-01', '2024-01-01')).toBe(0);
    });

    it('should return 0 for invalid dates', () => {
        expect(daysBetween('invalid', '2024-01-01')).toBe(0);
        expect(daysBetween('2024-01-01', 'invalid')).toBe(0);
    });
});
