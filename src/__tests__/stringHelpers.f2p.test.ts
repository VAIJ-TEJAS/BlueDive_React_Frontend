/**
 * F2P tests for stringHelpers - these test edge cases fixed in this PR
 */
import { describe, it, expect } from 'vitest';
import { truncateText } from '../utils/stringHelpers';

describe('truncateText edge cases', () => {
    it('should return empty string when maxLength is 0', () => {
        expect(truncateText('Hello', 0)).toBe('');
    });

    it('should return empty string when maxLength is negative', () => {
        expect(truncateText('Hello', -5)).toBe('');
    });

    it('should truncate to exact maxLength when maxLength is 1', () => {
        const result = truncateText('Hello World', 1);
        expect(result.length).toBeLessThanOrEqual(1);
    });

    it('should truncate to exact maxLength when maxLength is 2', () => {
        const result = truncateText('Hello World', 2);
        expect(result.length).toBeLessThanOrEqual(2);
    });

    it('should truncate to exact maxLength when maxLength is 3', () => {
        const result = truncateText('Hello World', 3);
        expect(result.length).toBeLessThanOrEqual(3);
    });

    it('should never return a string longer than maxLength', () => {
        for (let len = 1; len <= 10; len++) {
            const result = truncateText('This is a long test string', len);
            expect(result.length).toBeLessThanOrEqual(len);
        }
    });
});
