import { describe, it, expect } from 'vitest';
import { isValidPhone, isValidEmail, isNotEmpty, isValidPincode } from '../utils/validators';

describe('isValidPhone', () => {
    it('should accept valid Indian phone numbers', () => {
        expect(isValidPhone('9876543210')).toBe(true);
        expect(isValidPhone('6234567890')).toBe(true);
        expect(isValidPhone('7000000000')).toBe(true);
        expect(isValidPhone('8123456789')).toBe(true);
    });

    it('should accept numbers with spaces', () => {
        expect(isValidPhone('98765 43210')).toBe(true);
    });

    it('should reject numbers starting with 0-5', () => {
        expect(isValidPhone('0123456789')).toBe(false);
        expect(isValidPhone('1234567890')).toBe(false);
        expect(isValidPhone('5234567890')).toBe(false);
    });

    it('should reject numbers with wrong length', () => {
        expect(isValidPhone('987654321')).toBe(false);
        expect(isValidPhone('98765432101')).toBe(false);
    });

    it('should reject non-numeric input', () => {
        expect(isValidPhone('abcdefghij')).toBe(false);
        expect(isValidPhone('')).toBe(false);
    });
});

describe('isValidEmail', () => {
    it('should accept valid emails', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name@domain.co.in')).toBe(true);
        expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid emails', () => {
        expect(isValidEmail('invalid')).toBe(false);
        expect(isValidEmail('@example.com')).toBe(false);
        expect(isValidEmail('test@')).toBe(false);
        expect(isValidEmail('')).toBe(false);
        expect(isValidEmail('test @example.com')).toBe(false);
    });
});

describe('isNotEmpty', () => {
    it('should return true for non-empty strings', () => {
        expect(isNotEmpty('hello')).toBe(true);
        expect(isNotEmpty('  hello  ')).toBe(true);
    });

    it('should return false for empty or whitespace strings', () => {
        expect(isNotEmpty('')).toBe(false);
        expect(isNotEmpty('   ')).toBe(false);
    });

    it('should return false for null and undefined', () => {
        expect(isNotEmpty(null)).toBe(false);
        expect(isNotEmpty(undefined)).toBe(false);
    });
});

describe('isValidPincode', () => {
    it('should accept valid Indian pincodes', () => {
        expect(isValidPincode('110001')).toBe(true);
        expect(isValidPincode('400001')).toBe(true);
        expect(isValidPincode('560001')).toBe(true);
    });

    it('should reject pincodes starting with 0', () => {
        expect(isValidPincode('000000')).toBe(false);
        expect(isValidPincode('012345')).toBe(false);
    });

    it('should reject wrong length', () => {
        expect(isValidPincode('12345')).toBe(false);
        expect(isValidPincode('1234567')).toBe(false);
    });

    it('should reject non-numeric input', () => {
        expect(isValidPincode('abcdef')).toBe(false);
        expect(isValidPincode('1234ab')).toBe(false);
    });
});
