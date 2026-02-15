import { describe, it, expect } from 'vitest';
import { removeDuplicates, groupBy, chunk, sortByKey } from '../utils/arrayHelpers';

describe('removeDuplicates', () => {
    it('should remove duplicate numbers', () => {
        expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should remove duplicate strings', () => {
        expect(removeDuplicates(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should return empty array for empty input', () => {
        expect(removeDuplicates([])).toEqual([]);
    });

    it('should handle array with no duplicates', () => {
        expect(removeDuplicates([1, 2, 3])).toEqual([1, 2, 3]);
    });
});

describe('groupBy', () => {
    const items = [
        { category: 'fruit', name: 'apple' },
        { category: 'fruit', name: 'banana' },
        { category: 'veggie', name: 'carrot' },
    ];

    it('should group items by key', () => {
        const result = groupBy(items, 'category');
        expect(Object.keys(result)).toEqual(['fruit', 'veggie']);
        expect(result['fruit']).toHaveLength(2);
        expect(result['veggie']).toHaveLength(1);
    });

    it('should return empty object for empty array', () => {
        expect(groupBy([], 'category' as any)).toEqual({});
    });
});

describe('chunk', () => {
    it('should split array into chunks', () => {
        expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle exact division', () => {
        expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });

    it('should return empty array for empty input', () => {
        expect(chunk([], 3)).toEqual([]);
    });

    it('should return empty array for size 0', () => {
        expect(chunk([1, 2, 3], 0)).toEqual([]);
    });

    it('should handle chunk size larger than array', () => {
        expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });
});

describe('sortByKey', () => {
    const items = [
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
    ];

    it('should sort ascending by default', () => {
        const result = sortByKey(items, 'name');
        expect(result[0].name).toBe('Alice');
        expect(result[1].name).toBe('Bob');
        expect(result[2].name).toBe('Charlie');
    });

    it('should sort descending when specified', () => {
        const result = sortByKey(items, 'age', 'desc');
        expect(result[0].age).toBe(35);
        expect(result[2].age).toBe(25);
    });

    it('should not mutate original array', () => {
        const original = [...items];
        sortByKey(items, 'name');
        expect(items).toEqual(original);
    });
});
