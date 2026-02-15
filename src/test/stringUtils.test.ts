import {
  toTitleCase,
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  truncate,
  capitalize,
  slugify,
  normalizeWhitespace,
  isEmpty,
  isAlphanumeric,
  generateRandomString,
  maskString,
  countWords,
  getInitials,
  containsIgnoreCase,
  reverseString
} from '../utils/stringUtils';

describe('String Utils', () => {
  describe('toTitleCase', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
      expect(toTitleCase('hElLo wOrLd')).toBe('Hello World');
    });

    it('should handle single word', () => {
      expect(toTitleCase('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(toTitleCase('')).toBe('');
    });
  });

  describe('toCamelCase', () => {
    it('should convert to camel case', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
      expect(toCamelCase('Hello World')).toBe('helloWorld');
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('hello_world')).toBe('helloWorld');
    });

    it('should handle single word', () => {
      expect(toCamelCase('hello')).toBe('hello');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert to snake case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
      expect(toSnakeCase('Hello World')).toBe('hello_world');
      expect(toSnakeCase('hello-world')).toBe('hello_world');
      expect(toSnakeCase('hello world')).toBe('hello_world');
    });
  });

  describe('toKebabCase', () => {
    it('should convert to kebab case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
      expect(toKebabCase('Hello World')).toBe('hello-world');
      expect(toSnakeCase('hello_world')).toBe('hello-world');
      expect(toKebabCase('hello world')).toBe('hello-world');
    });
  });

  describe('truncate', () => {
    it('should truncate string with default suffix', () => {
      expect(truncate('Hello world', 8)).toBe('Hello...');
    });

    it('should truncate string with custom suffix', () => {
      expect(truncate('Hello world', 8, '---')).toBe('Hello---');
    });

    it('should not truncate if string is short enough', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
      expect(capitalize('hELLO')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('slugify', () => {
    it('should create URL-friendly slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('  Hello   World  ')).toBe('hello-world');
      expect(slugify('Hello@World#123')).toBe('helloworld123');
    });

    it('should handle special characters', () => {
      expect(slugify('Hello & World')).toBe('hello-world');
      expect(slugify('Hello\'s World')).toBe('hellos-world');
    });
  });

  describe('normalizeWhitespace', () => {
    it('should normalize whitespace', () => {
      expect(normalizeWhitespace('  Hello   World  ')).toBe('Hello World');
      expect(normalizeWhitespace('Hello\tWorld')).toBe('Hello World');
      expect(normalizeWhitespace('Hello\nWorld')).toBe('Hello World');
    });

    it('should handle empty string', () => {
      expect(normalizeWhitespace('')).toBe('');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty string', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('\t\n')).toBe(true);
    });

    it('should return false for non-empty string', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' hello ')).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('should return true for alphanumeric strings', () => {
      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('ABC')).toBe(true);
      expect(isAlphanumeric('123')).toBe(true);
    });

    it('should return false for non-alphanumeric strings', () => {
      expect(isAlphanumeric('abc-123')).toBe(false);
      expect(isAlphanumeric('abc 123')).toBe(false);
      expect(isAlphanumeric('abc@123')).toBe(false);
    });
  });

  describe('generateRandomString', () => {
    it('should generate random string of specified length', () => {
      const str = generateRandomString(10);
      expect(str).toHaveLength(10);
      expect(/^[A-Za-z0-9]+$/.test(str)).toBe(true);
    });

    it('should generate different strings on multiple calls', () => {
      const str1 = generateRandomString(10);
      const str2 = generateRandomString(10);
      expect(str1).not.toBe(str2);
    });
  });

  describe('maskString', () => {
    it('should mask string with default visible characters', () => {
      expect(maskString('1234567890')).toBe('1234******90');
    });

    it('should mask string with custom visible characters', () => {
      expect(maskString('1234567890', 2)).toBe('12********');
      expect(maskString('1234567890', 6)).toBe('123456****');
    });

    it('should handle short strings', () => {
      expect(maskString('123')).toBe('123');
      expect(maskString('12')).toBe('12');
    });

    it('should use custom mask character', () => {
      expect(maskString('1234567890', 4, '#')).toBe('1234######90');
    });
  });

  describe('countWords', () => {
    it('should count words correctly', () => {
      expect(countWords('Hello world')).toBe(2);
      expect(countWords('Hello   world  test')).toBe(3);
      expect(countWords('Hello')).toBe(1);
    });

    it('should handle empty string', () => {
      expect(countWords('')).toBe(0);
      expect(countWords('   ')).toBe(0);
    });

    it('should handle multiple spaces', () => {
      expect(countWords('  Hello   world  ')).toBe(2);
    });
  });

  describe('getInitials', () => {
    it('should get initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('John')).toBe('J');
      expect(getInitials('John Middle Doe')).toBe('JMD');
    });

    it('should limit initials', () => {
      expect(getInitials('John Middle Doe', 2)).toBe('JM');
      expect(getInitials('John Middle Doe', 1)).toBe('J');
    });

    it('should handle extra spaces', () => {
      expect(getInitials('  John  Doe  ')).toBe('JD');
    });
  });

  describe('containsIgnoreCase', () => {
    it('should check substring case-insensitively', () => {
      expect(containsIgnoreCase('Hello World', 'hello')).toBe(true);
      expect(containsIgnoreCase('Hello World', 'WORLD')).toBe(true);
      expect(containsIgnoreCase('Hello World', 'HeLLo')).toBe(true);
    });

    it('should return false for non-matching substring', () => {
      expect(containsIgnoreCase('Hello World', 'test')).toBe(false);
    });
  });

  describe('reverseString', () => {
    it('should reverse string', () => {
      expect(reverseString('hello')).toBe('olleh');
      expect(reverseString('Hello World')).toBe('dlroW olleH');
      expect(reverseString('')).toBe('');
    });
  });
});
