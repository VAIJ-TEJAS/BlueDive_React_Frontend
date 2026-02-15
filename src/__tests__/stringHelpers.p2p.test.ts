import { describe, it, expect } from 'vitest';
import { truncateText, capitalize, toTitleCase, slugify } from '../utils/stringHelpers';

describe('truncateText - edge cases', () => {
    it('should handle maxLength of 3 (minimum for ellipsis)', () => {
        expect(truncateText('Hello', 3)).toBe('Hel');
    });

    it('should handle very long text', () => {
        const longText = 'a'.repeat(1000);
        const result = truncateText(longText, 50);
        expect(result.length).toBe(50);
        expect(result.endsWith('...')).toBe(true);
    });
});

describe('capitalize - edge cases', () => {
    it('should not change numbers', () => {
        expect(capitalize('123abc')).toBe('123abc');
    });

    it('should handle string with leading space', () => {
        expect(capitalize(' hello')).toBe(' hello');
    });
});

describe('toTitleCase - edge cases', () => {
    it('should handle mixed case input', () => {
        expect(toTitleCase('hELLO wORLD')).toBe('Hello World');
    });

    it('should handle single letter words', () => {
        expect(toTitleCase('a b c')).toBe('A B C');
    });
});

describe('slugify - edge cases', () => {
    it('should handle underscores', () => {
        expect(slugify('hello_world')).toBe('hello-world');
    });

    it('should handle consecutive special chars', () => {
        expect(slugify('hello!!!world')).toBe('helloworld');
    });

    it('should handle numbers in string', () => {
        expect(slugify('page 1 of 10')).toBe('page-1-of-10');
    });
});
