import {
  removeDuplicates,
  shuffle,
  chunk,
  isEmpty,
  last,
  first,
  removeWhere,
  groupBy,
  sortBy,
  areEqual,
  flatten,
  range,
  intersection,
  difference,
  union,
  moveItem,
  paginate
} from '../utils/arrayUtils';

describe('Array Utils', () => {
  describe('removeDuplicates', () => {
    it('should remove duplicates from array', () => {
      const arr = [1, 2, 2, 3, 3, 4];
      const result = removeDuplicates(arr);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should handle empty array', () => {
      const result = removeDuplicates([]);
      expect(result).toEqual([]);
    });

    it('should handle array with all duplicates', () => {
      const arr = [1, 1, 1, 1];
      const result = removeDuplicates(arr);
      expect(result).toEqual([1]);
    });
  });

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = shuffle(arr);
      expect(result).toHaveLength(5);
      expect(result).toContain(1);
      expect(result).toContain(2);
      expect(result).toContain(3);
      expect(result).toContain(4);
      expect(result).toContain(5);
      expect(result).not.toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle empty array', () => {
      const result = shuffle([]);
      expect(result).toEqual([]);
    });
  });

  describe('chunk', () => {
    it('should chunk array into smaller arrays', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = chunk(arr, 3);
      expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
    });

    it('should handle array that doesn\'t divide evenly', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = chunk(arr, 2);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle empty array', () => {
      const result = chunk([], 3);
      expect(result).toEqual([]);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty array', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return false for non-empty array', () => {
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
    });
  });

  describe('last', () => {
    it('should return last element', () => {
      const arr = [1, 2, 3];
      expect(last(arr)).toBe(3);
    });

    it('should return undefined for empty array', () => {
      expect(last([])).toBeUndefined();
    });
  });

  describe('first', () => {
    it('should return first element', () => {
      const arr = [1, 2, 3];
      expect(first(arr)).toBe(1);
    });

    it('should return undefined for empty array', () => {
      expect(first([])).toBeUndefined();
    });
  });

  describe('removeWhere', () => {
    it('should remove elements based on condition', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = removeWhere(arr, (item) => item % 2 === 0);
      expect(result).toEqual([1, 3, 5]);
    });
  });

  describe('groupBy', () => {
    it('should group array elements by key', () => {
      const arr = [
        { id: 1, category: 'A' },
        { id: 2, category: 'B' },
        { id: 3, category: 'A' },
        { id: 4, category: 'C' }
      ];
      const result = groupBy(arr, 'category');
      
      expect(Object.keys(result)).toEqual(['A', 'B', 'C']);
      expect(result.A).toEqual([{ id: 1, category: 'A' }, { id: 3, category: 'A' }]);
      expect(result.B).toEqual([{ id: 2, category: 'B' }]);
      expect(result.C).toEqual([{ id: 4, category: 'C' }]);
    });
  });

  describe('sortBy', () => {
    it('should sort array by key in ascending order', () => {
      const arr = [
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 }
      ];
      const result = sortBy(arr, 'age');
      expect(result).toEqual([
        { name: 'Alice', age: 25 },
        { name: 'Charlie', age: 30 },
        { name: 'Bob', age: 35 }
      ]);
    });

    it('should sort array by key in descending order', () => {
      const arr = [
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 }
      ];
      const result = sortBy(arr, 'age', 'desc');
      expect(result).toEqual([
        { name: 'Bob', age: 35 },
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 }
      ]);
    });
  });

  describe('areEqual', () => {
    it('should return true for equal arrays', () => {
      expect(areEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(areEqual([], [])).toBe(true);
    });

    it('should return false for unequal arrays', () => {
      expect(areEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(areEqual([1, 2], [1, 2, 3])).toBe(false);
    });
  });

  describe('flatten', () => {
    it('should flatten nested array', () => {
      const arr = [1, [2, [3, [4]], 5];
      const result = flatten(arr);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle already flat array', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = flatten(arr);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('range', () => {
    it('should create range of numbers', () => {
      const result = range(1, 6);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should create range with custom step', () => {
      const result = range(0, 10, 2);
      expect(result).toEqual([0, 2, 4, 6, 8]);
    });
  });

  describe('intersection', () => {
    it('should find intersection of two arrays', () => {
      const arr1 = [1, 2, 3, 4];
      const arr2 = [3, 4, 5, 6];
      const result = intersection(arr1, arr2);
      expect(result).toEqual([3, 4]);
    });

    it('should handle empty arrays', () => {
      expect(intersection([], [1, 2, 3])).toEqual([]);
      expect(intersection([1, 2, 3], [])).toEqual([]);
    });
  });

  describe('difference', () => {
    it('should find difference between two arrays', () => {
      const arr1 = [1, 2, 3, 4];
      const arr2 = [3, 4, 5, 6];
      const result = difference(arr1, arr2);
      expect(result).toEqual([1, 2]);
    });
  });

  describe('union', () => {
    it('should create union of multiple arrays', () => {
      const arr1 = [1, 2, 3];
      const arr2 = [3, 4, 5];
      const arr3 = [5, 6, 7];
      const result = union(arr1, arr2, arr3);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe('moveItem', () => {
    it('should move item from one index to another', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = moveItem(arr, 1, 3);
      expect(result).toEqual([1, 3, 2, 4, 5]);
    });

    it('should handle moving to earlier index', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = moveItem(arr, 3, 1);
      expect(result).toEqual([4, 2, 3, 1, 5]);
    });
  });

  describe('paginate', () => {
    it('should paginate array', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = paginate(arr, 2, 3);
      
      expect(result.items).toEqual([4, 5, 6]);
      expect(result.totalPages).toBe(4);
      expect(result.currentPage).toBe(2);
      expect(result.hasNext).toBe(true);
      expect(result.hasPrev).toBe(true);
    });

    it('should handle last page', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = paginate(arr, 4, 3);
      
      expect(result.items).toEqual([10]);
      expect(result.totalPages).toBe(4);
      expect(result.currentPage).toBe(4);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrev).toBe(true);
    });

    it('should handle first page', () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = paginate(arr, 1, 3);
      
      expect(result.items).toEqual([1, 2, 3]);
      expect(result.totalPages).toBe(4);
      expect(result.currentPage).toBe(1);
      expect(result.hasNext).toBe(true);
      expect(result.hasPrev).toBe(false);
    });
  });
});
