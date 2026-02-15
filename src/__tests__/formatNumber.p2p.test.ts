import { describe, it, expect } from 'vitest';
import { formatNumber } from '../utils/formatNumber';

describe('formatNumber - extra cases', () => {
    it('should format thousands', () => {
        expect(formatNumber(5000)).toBe('5,000');
        expect(formatNumber(9999)).toBe('9,999');
    });

    it('should format large Indian numbers', () => {
        expect(formatNumber(1234567)).toBe('12,34,567');
        expect(formatNumber(50000000)).toBe('5,00,00,000');
    });

    it('should handle single digit', () => {
        expect(formatNumber(1)).toBe('1');
        expect(formatNumber(9)).toBe('9');
    });

    it('should handle hundred', () => {
        expect(formatNumber(100)).toBe('100');
        expect(formatNumber(999)).toBe('999');
    });

    it('should handle negative large numbers', () => {
        expect(formatNumber(-100000)).toBe('-1,00,000');
    });
});
