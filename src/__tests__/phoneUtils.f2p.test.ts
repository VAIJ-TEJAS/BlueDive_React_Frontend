/**
 * F2P tests for phoneUtils - these test edge cases fixed in this PR
 */
import { describe, it, expect } from 'vitest';
import { addCountryCode } from '../utils/phoneUtils';

describe('addCountryCode edge cases', () => {
    it('should return the phone as-is when it already has +91 prefix', () => {
        expect(addCountryCode('+919876543210')).toBe('+919876543210');
    });

    it('should not double-add country code when phone already has +91', () => {
        const result = addCountryCode('+919876543210');
        // Should NOT be +91919876543210
        expect(result).not.toContain('+9191');
    });

    it('should preserve the original format when phone has +91 with spaces', () => {
        const result = addCountryCode('+91 98765 43210');
        // After trimming, starts with +91 so should return as-is
        expect(result.startsWith('+91')).toBe(true);
        expect(result.replace(/\D/g, '').length).toBeLessThanOrEqual(12);
    });

    it('should add country code to plain 10-digit number', () => {
        expect(addCountryCode('9876543210')).toBe('+919876543210');
    });

    it('should handle number already starting with 91 without plus', () => {
        expect(addCountryCode('919876543210')).toBe('+919876543210');
    });
});
