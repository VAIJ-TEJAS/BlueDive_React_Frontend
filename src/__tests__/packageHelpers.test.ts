import { describe, it, expect } from 'vitest';
import {
    formatPrice,
    formatPriceRange,
    getDiscountedPrice,
    parseDuration,
    formatDuration,
    getSavingsText,
} from '../utils/packageHelpers';

describe('formatPrice', () => {
    it('should format price with rupee symbol', () => {
        expect(formatPrice(5000)).toBe('₹5,000');
        expect(formatPrice(100000)).toBe('₹1,00,000');
    });

    it('should return empty for null or undefined', () => {
        expect(formatPrice(null)).toBe('');
        expect(formatPrice(undefined)).toBe('');
    });

    it('should return empty for NaN', () => {
        expect(formatPrice(NaN)).toBe('');
    });

    it('should handle zero', () => {
        expect(formatPrice(0)).toBe('₹0');
    });
});

describe('formatPriceRange', () => {
    it('should show range for different prices', () => {
        const result = formatPriceRange(3000, 5000);
        expect(result).toContain('3,000');
        expect(result).toContain('5,000');
        expect(result).toContain('-');
    });

    it('should show single price when min equals max', () => {
        expect(formatPriceRange(4000, 4000)).toBe('₹4,000');
    });
});

describe('getDiscountedPrice', () => {
    it('should calculate discounted price', () => {
        expect(getDiscountedPrice(1000, 20)).toBe(800);
        expect(getDiscountedPrice(5000, 10)).toBe(4500);
    });

    it('should return original for 0 discount', () => {
        expect(getDiscountedPrice(1000, 0)).toBe(1000);
    });

    it('should return 0 for invalid price', () => {
        expect(getDiscountedPrice(0, 20)).toBe(0);
        expect(getDiscountedPrice(-100, 20)).toBe(0);
    });

    it('should return original for discount over 100', () => {
        expect(getDiscountedPrice(1000, 150)).toBe(1000);
    });

    it('should round to nearest integer', () => {
        expect(getDiscountedPrice(999, 33)).toBe(669);
    });
});

describe('parseDuration', () => {
    it('should parse days and nights', () => {
        expect(parseDuration('3 Days / 2 Nights')).toEqual({ days: 3, nights: 2 });
    });

    it('should parse days only', () => {
        expect(parseDuration('2 days')).toEqual({ days: 2, nights: 0 });
    });

    it('should parse single day', () => {
        expect(parseDuration('1 day')).toEqual({ days: 1, nights: 0 });
    });

    it('should return zeros for empty string', () => {
        expect(parseDuration('')).toEqual({ days: 0, nights: 0 });
    });

    it('should handle nights only', () => {
        expect(parseDuration('1 Night')).toEqual({ days: 0, nights: 1 });
    });
});

describe('formatDuration', () => {
    it('should format days and nights', () => {
        expect(formatDuration(3, 2)).toBe('3 Days / 2 Nights');
    });

    it('should format single day', () => {
        expect(formatDuration(1, 0)).toBe('1 Day');
    });

    it('should format nights only', () => {
        expect(formatDuration(0, 1)).toBe('1 Night');
    });

    it('should return empty for zero', () => {
        expect(formatDuration(0, 0)).toBe('');
    });
});

describe('getSavingsText', () => {
    it('should show savings amount', () => {
        const result = getSavingsText(5000, 4000);
        expect(result).toContain('Save');
        expect(result).toContain('1,000');
    });

    it('should return empty when no savings', () => {
        expect(getSavingsText(5000, 5000)).toBe('');
        expect(getSavingsText(5000, 6000)).toBe('');
    });

    it('should return empty for invalid inputs', () => {
        expect(getSavingsText(0, 0)).toBe('');
    });
});
