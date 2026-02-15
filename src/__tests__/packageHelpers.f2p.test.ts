/**
 * F2P tests for packageHelpers - these test edge cases fixed in this PR
 */
import { describe, it, expect } from 'vitest';
import { getSavingsText } from '../utils/packageHelpers';

describe('getSavingsText edge cases', () => {
    it('should show savings when discounted is 0 (free item)', () => {
        const result = getSavingsText(5000, 0);
        expect(result).not.toBe('');
        expect(result).toContain('5,000');
    });

    it('should show savings when discounted is 0 for large amounts', () => {
        const result = getSavingsText(10000, 0);
        expect(result).toContain('Save');
        expect(result).toContain('10,000');
    });

    it('should return empty for null discounted', () => {
        const result = getSavingsText(5000, null as any);
        expect(result).toBe('');
    });

    it('should return empty for undefined discounted', () => {
        const result = getSavingsText(5000, undefined as any);
        expect(result).toBe('');
    });

    it('should return empty for negative discounted', () => {
        const result = getSavingsText(5000, -100);
        expect(result).toBe('');
    });
});
