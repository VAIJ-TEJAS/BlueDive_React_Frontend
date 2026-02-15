/**
 * String manipulation utilities
 */

/**
 * Converts string to title case (first letter of each word capitalized)
 */
export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
};

/**
 * Converts string to camel case
 */
export const toCamelCase = (str: string): string => {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
};

/**
 * Converts string to snake case
 */
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_');
};

/**
 * Converts string to kebab case
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('-');
};

/**
 * Truncates string to specified length with ellipsis
 */
export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

/**
 * Capitalizes first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts string to slug (URL-friendly)
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Removes extra whitespace from string
 */
export const normalizeWhitespace = (str: string): string => {
  return str.replace(/\s+/g, ' ').trim();
};

/**
 * Checks if string is empty or contains only whitespace
 */
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Checks if string contains only alphanumeric characters
 */
export const isAlphanumeric = (str: string): boolean => {
  return /^[a-z0-9]+$/i.test(str);
};

/**
 * Generates random string of specified length
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Masks sensitive information (e.g., credit card numbers)
 */
export const maskString = (str: string, visibleChars: number = 4, maskChar: string = '*'): string => {
  if (str.length <= visibleChars) return str;
  const start = str.substring(0, visibleChars);
  const end = str.length > visibleChars * 2 ? str.substring(str.length - visibleChars) : '';
  const middle = str.length > visibleChars * 2 ? maskChar.repeat(str.length - visibleChars * 2) : '';
  return start + middle + end;
};

/**
 * Counts words in a string
 */
export const countWords = (str: string): number => {
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Extracts initials from a name
 */
export const getInitials = (name: string, maxInitials: number = 2): string => {
  const words = name.trim().split(/\s+/);
  return words
    .slice(0, maxInitials)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Checks if string contains a substring (case-insensitive)
 */
export const containsIgnoreCase = (str: string, searchStr: string): boolean => {
  return str.toLowerCase().includes(searchStr.toLowerCase());
};

/**
 * Reverses a string
 */
export const reverseString = (str: string): string => {
  return str.split('').reverse().join('');
};
