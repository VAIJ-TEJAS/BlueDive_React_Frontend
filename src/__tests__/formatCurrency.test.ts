import { describe, it, expect } from 'vitest';
import { formatCurrency, calculateDiscount } from '../utils/formatNumber';

describe('formatCurrency', () => {
    it('should format amount as INR currency', () => {
        const result = formatCurrency(5000);
        expect(result).toContain('5,000');
    });

    it('should handle zero', () => {
        const result = formatCurrency(0);
        expect(result).toContain('0');
    });

    it('should return fallback for NaN', () => {
        expect(formatCurrency(NaN)).toBe('₹0');
    });

    it('should return fallback for null', () => {
        expect(formatCurrency(null as any)).toBe('₹0');
    });

    it('should format large amounts correctly', () => {
        const result = formatCurrency(250000);
        expect(result).toContain('2,50,000');
    });
});

describe('calculateDiscount', () => {
    it('should calculate discount percentage', () => {
        expect(calculateDiscount(1000, 800)).toBe(20);
        expect(calculateDiscount(5000, 4000)).toBe(20);
        expect(calculateDiscount(200, 150)).toBe(25);
    });

    it('should return 0 when original is 0 or negative', () => {
        expect(calculateDiscount(0, 100)).toBe(0);
        expect(calculateDiscount(-100, 50)).toBe(0);
    });

    it('should return 0 when discounted is greater than original', () => {
        expect(calculateDiscount(100, 200)).toBe(0);
    });

    it('should return 0 when discounted is negative', () => {
        expect(calculateDiscount(100, -10)).toBe(0);
    });

    it('should round to nearest integer', () => {
        expect(calculateDiscount(300, 200)).toBe(33);
    });
});
