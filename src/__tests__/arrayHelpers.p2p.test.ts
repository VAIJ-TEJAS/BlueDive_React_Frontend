import { describe, it, expect } from 'vitest';
import { removeDuplicates, groupBy, chunk, sortByKey } from '../utils/arrayHelpers';

describe('removeDuplicates - additional cases', () => {
    it('should handle array of booleans', () => {
        expect(removeDuplicates([true, false, true, false])).toEqual([true, false]);
    });

    it('should handle single element array', () => {
        expect(removeDuplicates([42])).toEqual([42]);
    });

    it('should preserve order of first occurrence', () => {
        expect(removeDuplicates([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
    });
});

describe('groupBy - additional cases', () => {
    it('should group by numeric key', () => {
        const items = [
            { type: 1, name: 'a' },
            { type: 2, name: 'b' },
            { type: 1, name: 'c' },
        ];
        const result = groupBy(items, 'type');
        expect(result['1']).toHaveLength(2);
        expect(result['2']).toHaveLength(1);
    });

    it('should handle all items in same group', () => {
        const items = [
            { status: 'active', id: 1 },
            { status: 'active', id: 2 },
        ];
        const result = groupBy(items, 'status');
        expect(Object.keys(result)).toHaveLength(1);
        expect(result['active']).toHaveLength(2);
    });
});

describe('chunk - additional cases', () => {
    it('should handle chunk size of 1', () => {
        expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });

    it('should handle single element', () => {
        expect(chunk([1], 3)).toEqual([[1]]);
    });

    it('should return empty for negative size', () => {
        expect(chunk([1, 2], -1)).toEqual([]);
    });
});

describe('sortByKey - additional cases', () => {
    it('should handle string sorting', () => {
        const items = [
            { label: 'banana' },
            { label: 'apple' },
            { label: 'cherry' },
        ];
        const result = sortByKey(items, 'label');
        expect(result.map(i => i.label)).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should handle equal values', () => {
        const items = [
            { val: 1, id: 'a' },
            { val: 1, id: 'b' },
        ];
        const result = sortByKey(items, 'val');
        expect(result).toHaveLength(2);
    });

    it('should handle empty array', () => {
        expect(sortByKey([], 'key' as any)).toEqual([]);
    });
});
