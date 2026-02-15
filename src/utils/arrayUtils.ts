/**
 * Array manipulation utilities
 */

/**
 * Removes duplicates from an array
 */
export const removeDuplicates = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

/**
 * Shuffles an array randomly
 */
export const shuffle = <T>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Chunks an array into smaller arrays of specified size
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Checks if array is empty
 */
export const isEmpty = <T>(arr: T[]): boolean => {
  return arr.length === 0;
};

/**
 * Gets the last element of an array
 */
export const last = <T>(arr: T[]): T | undefined => {
  return arr[arr.length - 1];
};

/**
 * Gets the first element of an array
 */
export const first = <T>(arr: T[]): T | undefined => {
  return arr[0];
};

/**
 * Removes elements from array based on condition
 */
export const removeWhere = <T>(arr: T[], condition: (item: T) => boolean): T[] => {
  return arr.filter(item => !condition(item));
};

/**
 * Groups array elements by a key
 */
export const groupBy = <T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> => {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Sorts array of objects by a key
 */
export const sortBy = <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Checks if two arrays are equal
 */
export const areEqual = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
};

/**
 * Flattens nested array
 */
export const flatten = <T>(arr: (T | T[])[]): T[] => {
  return arr.reduce<T[]>((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
};

/**
 * Creates array of numbers in range
 */
export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

/**
 * Finds intersection of two arrays
 */
export const intersection = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter(item => arr2.includes(item));
};

/**
 * Finds difference between two arrays (elements in arr1 not in arr2)
 */
export const difference = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter(item => !arr2.includes(item));
};

/**
 * Creates array with unique values from multiple arrays
 */
export const union = <T>(...arrays: T[][]): T[] => {
  return removeDuplicates(arrays.flat());
};

/**
 * Moves an item from one index to another
 */
export const moveItem = <T>(arr: T[], fromIndex: number, toIndex: number): T[] => {
  const result = [...arr];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
};

/**
 * Paginates array
 */
export const paginate = <T>(arr: T[], page: number, pageSize: number): {
  items: T[];
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
} => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = arr.slice(startIndex, endIndex);
  const totalPages = Math.ceil(arr.length / pageSize);
  
  return {
    items,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};
