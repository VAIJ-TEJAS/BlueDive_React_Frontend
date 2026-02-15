/**
 * F2P tests for urlHelpers - these test edge cases fixed in this PR
 */
import { describe, it, expect } from 'vitest';
import { buildQueryString } from '../utils/urlHelpers';

describe('buildQueryString null handling', () => {
    it('should filter out null values', () => {
        const result = buildQueryString({ name: 'test', age: null as any });
        expect(result).toBe('?name=test');
    });

    it('should filter out both null and undefined values', () => {
        const result = buildQueryString({
            a: 'hello',
            b: null as any,
            c: undefined,
            d: 'world',
        });
        expect(result).toBe('?a=hello&d=world');
    });

    it('should return empty string when all values are null', () => {
        const result = buildQueryString({
            a: null as any,
            b: null as any,
        });
        expect(result).toBe('');
    });

    it('should not include null as string "null" in query', () => {
        const result = buildQueryString({ key: null as any });
        expect(result).not.toContain('null');
    });
});
