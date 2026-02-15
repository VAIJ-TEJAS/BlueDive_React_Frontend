/**
 * F2P tests for bookingHelpers - these test edge cases fixed in this PR
 */
import { describe, it, expect } from 'vitest';
import { getAdvanceAmount } from '../utils/bookingHelpers';

describe('getAdvanceAmount edge cases', () => {
    it('should return 0 for negative pax count', () => {
        expect(getAdvanceAmount(-2)).toBe(0);
    });

    it('should return 0 for zero pax count', () => {
        expect(getAdvanceAmount(0)).toBe(0);
    });

    it('should return 0 for negative advancePerPax', () => {
        expect(getAdvanceAmount(3, -500)).toBe(0);
    });

    it('should return 0 for zero advancePerPax', () => {
        expect(getAdvanceAmount(3, 0)).toBe(0);
    });

    it('should return 0 when both are negative', () => {
        expect(getAdvanceAmount(-1, -100)).toBe(0);
    });
});
