import { describe, it, expect } from 'vitest';
import { formatDate, isDateInPast, daysBetween } from '../utils/dateHelpers';

describe('formatDate - additional cases', () => {
    it('should format date with day included', () => {
        const result = formatDate('2024-12-25');
        expect(result).toContain('25');
        expect(result).toContain('Dec');
    });

    it('should handle Date object from specific month', () => {
        const result = formatDate(new Date(2024, 0, 1));
        expect(result).toContain('Jan');
    });

    it('should handle ISO string format', () => {
        const result = formatDate('2024-03-15T10:30:00Z');
        expect(result).toContain('Mar');
        expect(result).toContain('2024');
    });
});

describe('isDateInPast - additional cases', () => {
    it('should return true for a date from last year', () => {
        expect(isDateInPast('2023-06-01')).toBe(true);
    });

    it('should return true for a very old date', () => {
        expect(isDateInPast('1990-01-01')).toBe(true);
    });

    it('should return false for a date far in the future', () => {
        expect(isDateInPast('2050-01-01')).toBe(false);
    });
});

describe('daysBetween - additional cases', () => {
    it('should handle year boundary', () => {
        expect(daysBetween('2023-12-31', '2024-01-01')).toBe(1);
    });

    it('should handle leap year', () => {
        expect(daysBetween('2024-02-28', '2024-03-01')).toBe(2);
    });

    it('should handle large range', () => {
        const result = daysBetween('2024-01-01', '2024-12-31');
        expect(result).toBe(365);
    });
});
