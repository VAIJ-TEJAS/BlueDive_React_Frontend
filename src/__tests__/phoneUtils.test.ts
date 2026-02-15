import { describe, it, expect } from 'vitest';
import { formatPhoneDisplay, maskPhone, stripCountryCode, addCountryCode } from '../utils/phoneUtils';

describe('formatPhoneDisplay', () => {
    it('should format 10-digit number with space', () => {
        expect(formatPhoneDisplay('9876543210')).toBe('98765 43210');
    });

    it('should format 12-digit number with country code', () => {
        expect(formatPhoneDisplay('919876543210')).toBe('+91 98765 43210');
    });

    it('should return original for other lengths', () => {
        expect(formatPhoneDisplay('12345')).toBe('12345');
    });

    it('should return empty for empty input', () => {
        expect(formatPhoneDisplay('')).toBe('');
    });
});

describe('maskPhone', () => {
    it('should mask all but last 4 digits', () => {
        expect(maskPhone('9876543210')).toBe('******3210');
    });

    it('should handle short numbers', () => {
        expect(maskPhone('123')).toBe('123');
    });

    it('should handle 4-digit number', () => {
        expect(maskPhone('1234')).toBe('1234');
    });

    it('should return empty for empty input', () => {
        expect(maskPhone('')).toBe('');
    });

    it('should mask number with country code', () => {
        expect(maskPhone('919876543210')).toBe('********3210');
    });
});

describe('stripCountryCode', () => {
    it('should strip +91 prefix', () => {
        expect(stripCountryCode('+919876543210')).toBe('9876543210');
    });

    it('should strip 91 prefix without plus', () => {
        expect(stripCountryCode('919876543210')).toBe('9876543210');
    });

    it('should return as-is for 10-digit number', () => {
        expect(stripCountryCode('9876543210')).toBe('9876543210');
    });

    it('should return empty for empty input', () => {
        expect(stripCountryCode('')).toBe('');
    });
});

describe('addCountryCode', () => {
    it('should add +91 to 10-digit number', () => {
        expect(addCountryCode('9876543210')).toBe('+919876543210');
    });

    it('should not double-add country code', () => {
        expect(addCountryCode('919876543210')).toBe('+919876543210');
    });

    it('should handle custom country code', () => {
        expect(addCountryCode('5551234567', '1')).toBe('+15551234567');
    });

    it('should return empty for empty input', () => {
        expect(addCountryCode('')).toBe('');
    });
});
