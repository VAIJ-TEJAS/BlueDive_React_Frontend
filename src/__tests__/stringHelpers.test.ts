import { describe, it, expect } from 'vitest';
import { truncateText, capitalize, toTitleCase, slugify } from '../utils/stringHelpers';

describe('truncateText', () => {
    it('should truncate long text with ellipsis', () => {
        expect(truncateText('This is a long sentence', 10)).toBe('This is...');
    });

    it('should return original text if within limit', () => {
        expect(truncateText('Short', 10)).toBe('Short');
    });

    it('should handle empty string', () => {
        expect(truncateText('', 10)).toBe('');
    });

    it('should handle exact length', () => {
        expect(truncateText('12345', 5)).toBe('12345');
    });
});

describe('capitalize', () => {
    it('should capitalize first letter', () => {
        expect(capitalize('hello')).toBe('Hello');
        expect(capitalize('world')).toBe('World');
    });

    it('should handle single character', () => {
        expect(capitalize('a')).toBe('A');
    });

    it('should handle empty string', () => {
        expect(capitalize('')).toBe('');
    });

    it('should handle already capitalized', () => {
        expect(capitalize('Hello')).toBe('Hello');
    });
});

describe('toTitleCase', () => {
    it('should convert to title case', () => {
        expect(toTitleCase('hello world')).toBe('Hello World');
        expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox');
    });

    it('should handle single word', () => {
        expect(toTitleCase('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
        expect(toTitleCase('')).toBe('');
    });

    it('should handle uppercase input', () => {
        expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
    });
});

describe('slugify', () => {
    it('should create url-friendly slug', () => {
        expect(slugify('Hello World')).toBe('hello-world');
        expect(slugify('My Blog Post')).toBe('my-blog-post');
    });

    it('should remove special characters', () => {
        expect(slugify('Hello! World?')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
        expect(slugify('hello   world')).toBe('hello-world');
    });

    it('should handle empty string', () => {
        expect(slugify('')).toBe('');
    });

    it('should trim leading and trailing hyphens', () => {
        expect(slugify(' hello world ')).toBe('hello-world');
    });
});
