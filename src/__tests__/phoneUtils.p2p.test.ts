import { describe, it, expect } from 'vitest';
import { formatPhoneDisplay, maskPhone, stripCountryCode, addCountryCode } from '../utils/phoneUtils';

describe('formatPhoneDisplay - extra cases', () => {
    it('should format standard mobile number', () => {
        expect(formatPhoneDisplay('8765432109')).toBe('87654 32109');
    });

    it('should handle number with dashes', () => {
        expect(formatPhoneDisplay('98-765-43210')).toBe('98765 43210');
    });

    it('should handle number with spaces already', () => {
        expect(formatPhoneDisplay('98765 43210')).toBe('98765 43210');
    });
});

describe('maskPhone - extra cases', () => {
    it('should mask 10-digit number showing last 4', () => {
        expect(maskPhone('8765432109')).toBe('******2109');
    });

    it('should handle 5-digit number', () => {
        expect(maskPhone('12345')).toBe('*2345');
    });

    it('should handle exactly 4 digits', () => {
        expect(maskPhone('9876')).toBe('9876');
    });
});

describe('stripCountryCode - extra cases', () => {
    it('should handle number without country code', () => {
        expect(stripCountryCode('8765432109')).toBe('8765432109');
    });

    it('should strip 91 from 12-digit number', () => {
        expect(stripCountryCode('918765432109')).toBe('8765432109');
    });
});

describe('addCountryCode - extra cases', () => {
    it('should add default +91 code', () => {
        expect(addCountryCode('8765432109')).toBe('+918765432109');
    });

    it('should handle number with spaces', () => {
        expect(addCountryCode('87654 32109')).toBe('+918765432109');
    });

    it('should handle number with dashes', () => {
        expect(addCountryCode('876-543-2109')).toBe('+918765432109');
    });
});
