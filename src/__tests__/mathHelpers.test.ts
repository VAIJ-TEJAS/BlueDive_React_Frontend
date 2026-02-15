import { describe, it, expect } from 'vitest';
import { clamp, roundTo, percentage, sum, average, formatCompact } from '../utils/mathHelpers';

describe('clamp', () => {
    it('should clamp value within range', () => {
        expect(clamp(5, 0, 10)).toBe(5);
    });

    it('should clamp to min when below', () => {
        expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('should clamp to max when above', () => {
        expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should handle equal min and max', () => {
        expect(clamp(5, 3, 3)).toBe(3);
    });
});

describe('roundTo', () => {
    it('should round to specified decimals', () => {
        expect(roundTo(3.14159, 2)).toBe(3.14);
        expect(roundTo(3.14159, 0)).toBe(3);
    });

    it('should handle negative decimals', () => {
        expect(roundTo(3.7, -1)).toBe(4);
    });

    it('should handle whole numbers', () => {
        expect(roundTo(5, 2)).toBe(5);
    });
});

describe('percentage', () => {
    it('should calculate percentage', () => {
        expect(percentage(25, 100)).toBe(25);
        expect(percentage(1, 3)).toBe(33.3);
    });

    it('should return 0 for zero total', () => {
        expect(percentage(5, 0)).toBe(0);
    });

    it('should handle 100%', () => {
        expect(percentage(50, 50)).toBe(100);
    });
});

describe('sum', () => {
    it('should sum array of numbers', () => {
        expect(sum([1, 2, 3, 4])).toBe(10);
    });

    it('should return 0 for empty array', () => {
        expect(sum([])).toBe(0);
    });

    it('should handle negative numbers', () => {
        expect(sum([10, -3, 5])).toBe(12);
    });
});

describe('average', () => {
    it('should calculate average', () => {
        expect(average([2, 4, 6])).toBe(4);
    });

    it('should return 0 for empty array', () => {
        expect(average([])).toBe(0);
    });

    it('should handle decimal results', () => {
        expect(average([1, 2])).toBe(1.5);
    });
});

describe('formatCompact', () => {
    it('should format crores', () => {
        expect(formatCompact(15000000)).toBe('1.5 Cr');
    });

    it('should format lakhs', () => {
        expect(formatCompact(250000)).toBe('2.5 L');
    });

    it('should format thousands', () => {
        expect(formatCompact(5500)).toBe('5.5 K');
    });

    it('should return plain number for small values', () => {
        expect(formatCompact(999)).toBe('999');
    });

    it('should handle exact boundaries', () => {
        expect(formatCompact(10000000)).toBe('1 Cr');
        expect(formatCompact(100000)).toBe('1 L');
        expect(formatCompact(1000)).toBe('1 K');
    });

    it('should handle zero', () => {
        expect(formatCompact(0)).toBe('0');
    });

    it('should format tens of crores', () => {
        expect(formatCompact(50000000)).toBe('5 Cr');
    });

    it('should format hundreds of thousands', () => {
        expect(formatCompact(750000)).toBe('7.5 L');
    });
});
