import { describe, it, expect } from 'vitest';
import { formatNumber } from '../utils/formatNumber';

describe('formatNumber', () => {
    it('should format numbers with Indian locale', () => {
        expect(formatNumber(1000)).toBe('1,000');
        expect(formatNumber(100000)).toBe('1,00,000');
        expect(formatNumber(10000000)).toBe('1,00,00,000');
    });

    it('should handle small numbers', () => {
        expect(formatNumber(0)).toBe('0');
        expect(formatNumber(5)).toBe('5');
        expect(formatNumber(99)).toBe('99');
    });

    it('should handle negative numbers', () => {
        expect(formatNumber(-500)).toBe('-500');
        expect(formatNumber(-10000)).toBe('-10,000');
    });

    it('should handle decimal numbers', () => {
        expect(formatNumber(1234.56)).toContain('1,234');
    });

    it('should format lakhs and crores', () => {
        expect(formatNumber(250000)).toBe('2,50,000');
        expect(formatNumber(15000000)).toBe('1,50,00,000');
    });
});
