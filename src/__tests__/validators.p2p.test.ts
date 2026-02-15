import { describe, it, expect } from 'vitest';
import { isValidPhone, isValidEmail, isNotEmpty, isValidPincode } from '../utils/validators';

describe('isValidPhone - additional cases', () => {
    it('should handle phone with country code prefix stripped', () => {
        expect(isValidPhone('9123456789')).toBe(true);
    });

    it('should reject phone with letters mixed in', () => {
        expect(isValidPhone('91234a6789')).toBe(false);
    });

    it('should reject empty string', () => {
        expect(isValidPhone('')).toBe(false);
    });
});

describe('isValidEmail - additional cases', () => {
    it('should accept email with subdomain', () => {
        expect(isValidEmail('user@mail.example.com')).toBe(true);
    });

    it('should accept email with dots in local part', () => {
        expect(isValidEmail('first.last@example.com')).toBe(true);
    });

    it('should reject double at sign', () => {
        expect(isValidEmail('user@@example.com')).toBe(false);
    });
});

describe('isNotEmpty - additional cases', () => {
    it('should return true for string with numbers', () => {
        expect(isNotEmpty('123')).toBe(true);
    });

    it('should return true for single character', () => {
        expect(isNotEmpty('a')).toBe(true);
    });

    it('should return false for tab-only string', () => {
        expect(isNotEmpty('\t')).toBe(false);
    });
});

describe('isValidPincode - additional cases', () => {
    it('should accept pincode starting with 9', () => {
        expect(isValidPincode('900001')).toBe(true);
    });

    it('should reject pincode with spaces', () => {
        expect(isValidPincode('110 001')).toBe(false);
    });
});
