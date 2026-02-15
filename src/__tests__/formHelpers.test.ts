import { describe, it, expect } from 'vitest';
import {
    validateRequired,
    validateMinLength,
    validateMaxLength,
    validatePattern,
    collectErrors,
    hasErrors,
    getFieldError,
} from '../utils/formHelpers';

describe('validateRequired', () => {
    it('should return error for empty string', () => {
        const result = validateRequired('', 'Name');
        expect(result).not.toBeNull();
        expect(result!.field).toBe('Name');
        expect(result!.message).toContain('required');
    });

    it('should return error for whitespace only', () => {
        expect(validateRequired('   ', 'Name')).not.toBeNull();
    });

    it('should return null for valid value', () => {
        expect(validateRequired('John', 'Name')).toBeNull();
    });
});

describe('validateMinLength', () => {
    it('should return error for short value', () => {
        const result = validateMinLength('ab', 3, 'Name');
        expect(result).not.toBeNull();
        expect(result!.message).toContain('at least 3');
    });

    it('should return null for valid length', () => {
        expect(validateMinLength('abc', 3, 'Name')).toBeNull();
    });

    it('should return null for empty value (not its job)', () => {
        expect(validateMinLength('', 3, 'Name')).toBeNull();
    });
});

describe('validateMaxLength', () => {
    it('should return error for long value', () => {
        const result = validateMaxLength('abcdef', 5, 'Name');
        expect(result).not.toBeNull();
        expect(result!.message).toContain('at most 5');
    });

    it('should return null for valid length', () => {
        expect(validateMaxLength('abc', 5, 'Name')).toBeNull();
    });
});

describe('validatePattern', () => {
    it('should return error for non-matching pattern', () => {
        const result = validatePattern('abc', /^\d+$/, 'Phone');
        expect(result).not.toBeNull();
    });

    it('should return null for matching pattern', () => {
        expect(validatePattern('123', /^\d+$/, 'Phone')).toBeNull();
    });

    it('should use custom message', () => {
        const result = validatePattern('abc', /^\d+$/, 'Phone', 'Numbers only');
        expect(result!.message).toBe('Numbers only');
    });

    it('should return null for empty value', () => {
        expect(validatePattern('', /^\d+$/, 'Phone')).toBeNull();
    });
});

describe('collectErrors', () => {
    it('should filter out nulls', () => {
        const errors = collectErrors(
            null,
            { field: 'Name', message: 'required' },
            null,
            { field: 'Email', message: 'invalid' }
        );
        expect(errors).toHaveLength(2);
    });

    it('should return empty array when all null', () => {
        expect(collectErrors(null, null)).toEqual([]);
    });
});

describe('hasErrors', () => {
    it('should return true when errors exist', () => {
        expect(hasErrors([{ field: 'Name', message: 'required' }])).toBe(true);
    });

    it('should return false for empty array', () => {
        expect(hasErrors([])).toBe(false);
    });
});

describe('getFieldError', () => {
    const errors = [
        { field: 'Name', message: 'Name is required' },
        { field: 'Email', message: 'Email is invalid' },
    ];

    it('should return message for existing field', () => {
        expect(getFieldError(errors, 'Name')).toBe('Name is required');
    });

    it('should return undefined for non-existing field', () => {
        expect(getFieldError(errors, 'Phone')).toBeUndefined();
    });

    it('should return undefined for empty errors', () => {
        expect(getFieldError([], 'Name')).toBeUndefined();
    });

    it('should return first match when multiple errors for same field', () => {
        const dupes = [
            { field: 'Name', message: 'too short' },
            { field: 'Name', message: 'invalid chars' },
        ];
        expect(getFieldError(dupes, 'Name')).toBe('too short');
    });
});
