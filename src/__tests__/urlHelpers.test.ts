import { describe, it, expect } from 'vitest';
import {
    buildQueryString,
    parseQueryString,
    buildPackageUrl,
    buildBookingUrl,
    isExternalUrl,
} from '../utils/urlHelpers';

describe('buildQueryString', () => {
    it('should build query string from params', () => {
        const result = buildQueryString({ page: 1, sort: 'name' });
        expect(result).toBe('?page=1&sort=name');
    });

    it('should skip undefined values', () => {
        const result = buildQueryString({ page: 1, sort: undefined });
        expect(result).toBe('?page=1');
    });

    it('should skip empty string values', () => {
        const result = buildQueryString({ page: 1, q: '' });
        expect(result).toBe('?page=1');
    });

    it('should return empty string for no params', () => {
        expect(buildQueryString({})).toBe('');
    });

    it('should encode special characters', () => {
        const result = buildQueryString({ q: 'hello world' });
        expect(result).toBe('?q=hello%20world');
    });

    it('should handle boolean values', () => {
        const result = buildQueryString({ active: true });
        expect(result).toBe('?active=true');
    });
});

describe('parseQueryString', () => {
    it('should parse query string with leading ?', () => {
        expect(parseQueryString('?page=1&sort=name')).toEqual({ page: '1', sort: 'name' });
    });

    it('should parse query string without leading ?', () => {
        expect(parseQueryString('page=2')).toEqual({ page: '2' });
    });

    it('should return empty object for empty string', () => {
        expect(parseQueryString('')).toEqual({});
    });

    it('should return empty object for just ?', () => {
        expect(parseQueryString('?')).toEqual({});
    });

    it('should handle encoded values', () => {
        const result = parseQueryString('?q=hello%20world');
        expect(result.q).toBe('hello world');
    });
});

describe('buildPackageUrl', () => {
    it('should build package URL', () => {
        expect(buildPackageUrl('Konkan Adventure')).toBe('/package/Konkan%20Adventure');
    });

    it('should return fallback for empty name', () => {
        expect(buildPackageUrl('')).toBe('/tour-packages');
    });
});

describe('buildBookingUrl', () => {
    it('should build booking URL without trip', () => {
        expect(buildBookingUrl('Beach Trip')).toBe('/booking/Beach%20Trip');
    });

    it('should build booking URL with trip id', () => {
        expect(buildBookingUrl('Beach Trip', 42)).toBe('/booking/Beach%20Trip?trip=42');
    });

    it('should return fallback for empty name', () => {
        expect(buildBookingUrl('')).toBe('/tour-packages');
    });
});

describe('isExternalUrl', () => {
    it('should return true for http urls', () => {
        expect(isExternalUrl('http://example.com')).toBe(true);
    });

    it('should return true for https urls', () => {
        expect(isExternalUrl('https://example.com')).toBe(true);
    });

    it('should return false for relative paths', () => {
        expect(isExternalUrl('/about')).toBe(false);
        expect(isExternalUrl('about')).toBe(false);
    });

    it('should return false for empty string', () => {
        expect(isExternalUrl('')).toBe(false);
    });
});
