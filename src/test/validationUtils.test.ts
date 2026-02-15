import {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isAlpha,
  isAlphanumeric,
  isNumeric,
  isStrongPassword,
  isValidPincode,
  isRequired,
  minLength,
  maxLength,
  isInRange,
  isFutureDate,
  isPastDate,
  isToday,
  isValidFileSize,
  isValidFileType,
  isValidCreditCard,
  isValidPAN,
  isValidAadhaar,
  isValidGST
} from '../utils/validationUtils';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct Indian phone numbers', () => {
      expect(isValidPhone('9876543210')).toBe(true);
      expect(isValidPhone('6234567890')).toBe(true);
      expect(isValidPhone('91234 56789')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('1234567890')).toBe(false);
      expect(isValidPhone('987654321')).toBe(false);
      expect(isValidPhone('98765432101')).toBe(false);
      expect(isValidPhone('abcdefghij')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
    });
  });

  describe('isAlpha', () => {
    it('should validate alphabetic strings', () => {
      expect(isAlpha('abc')).toBe(true);
      expect(isAlpha('ABC')).toBe(true);
      expect(isAlpha('AbC')).toBe(true);
    });

    it('should reject non-alphabetic strings', () => {
      expect(isAlpha('abc123')).toBe(false);
      expect(isAlpha('abc def')).toBe(false);
      expect(isAlpha('123')).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('should validate alphanumeric strings', () => {
      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('ABC')).toBe(true);
      expect(isAlphanumeric('123')).toBe(true);
    });

    it('should reject non-alphanumeric strings', () => {
      expect(isAlphanumeric('abc-123')).toBe(false);
      expect(isAlphanumeric('abc 123')).toBe(false);
      expect(isAlphanumeric('abc@123')).toBe(false);
    });
  });

  describe('isNumeric', () => {
    it('should validate numeric strings', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('0')).toBe(true);
    });

    it('should reject non-numeric strings', () => {
      expect(isNumeric('abc')).toBe(false);
      expect(isNumeric('123abc')).toBe(false);
      expect(isNumeric('12.3')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should validate strong passwords', () => {
      const result = isStrongPassword('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should reject weak passwords with specific errors', () => {
      const result = isStrongPassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('Password must be at least 8 characters long');
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
      expect(result.errors).toContain('Password must contain at least one number');
      expect(result.errors).toContain('Password must contain at least one special character');
    });
  });

  describe('isValidPincode', () => {
    it('should validate correct Indian pincodes', () => {
      expect(isValidPincode('110001')).toBe(true);
      expect(isValidPincode('560001')).toBe(true);
    });

    it('should reject invalid pincodes', () => {
      expect(isValidPincode('000000')).toBe(false);
      expect(isValidPincode('12345')).toBe(false);
      expect(isValidPincode('1234567')).toBe(false);
    });
  });

  describe('isRequired', () => {
    it('should validate required values', () => {
      expect(isRequired('hello')).toBe(true);
      expect(isRequired(123)).toBe(true);
      expect(isRequired([1, 2, 3])).toBe(true);
      expect(isRequired({ key: 'value' })).toBe(true);
    });

    it('should reject empty values', () => {
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
      expect(isRequired([])).toBe(false);
    });
  });

  describe('minLength', () => {
    it('should validate minimum length', () => {
      expect(minLength('hello', 3)).toBe(true);
      expect(minLength('hello', 5)).toBe(true);
    });

    it('should reject strings below minimum length', () => {
      expect(minLength('hello', 6)).toBe(false);
    });
  });

  describe('maxLength', () => {
    it('should validate maximum length', () => {
      expect(maxLength('hello', 10)).toBe(true);
      expect(maxLength('hello', 5)).toBe(true);
    });

    it('should reject strings above maximum length', () => {
      expect(maxLength('hello', 4)).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('should validate number in range', () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange(1, 1, 10)).toBe(true);
      expect(isInRange(10, 1, 10)).toBe(true);
    });

    it('should reject numbers outside range', () => {
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(11, 1, 10)).toBe(false);
    });
  });

  describe('isFutureDate', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should validate future dates', () => {
      expect(isFutureDate('2024-01-16')).toBe(true);
      expect(isFutureDate('2025-01-01')).toBe(true);
    });

    it('should reject past and current dates', () => {
      expect(isFutureDate('2024-01-14')).toBe(false);
      expect(isFutureDate('2024-01-15')).toBe(false);
    });
  });

  describe('isPastDate', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should validate past dates', () => {
      expect(isPastDate('2024-01-14')).toBe(true);
      expect(isPastDate('2023-01-01')).toBe(true);
    });

    it('should reject future and current dates', () => {
      expect(isPastDate('2024-01-16')).toBe(false);
      expect(isPastDate('2024-01-15')).toBe(false);
    });
  });

  describe('isToday', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-15'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should validate today\'s date', () => {
      expect(isToday('2024-01-15')).toBe(true);
      expect(isToday(new Date('2024-01-15'))).toBe(true);
    });

    it('should reject other dates', () => {
      expect(isToday('2024-01-14')).toBe(false);
      expect(isToday('2024-01-16')).toBe(false);
    });
  });

  describe('isValidFileSize', () => {
    it('should validate file size within limit', () => {
      expect(isValidFileSize(1024, 2048)).toBe(true);
      expect(isValidFileSize(2048, 2048)).toBe(true);
    });

    it('should reject file size exceeding limit', () => {
      expect(isValidFileSize(4096, 2048)).toBe(false);
    });
  });

  describe('isValidFileType', () => {
    it('should validate allowed file types', () => {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      expect(isValidFileType('image/jpeg', allowedTypes)).toBe(true);
      expect(isValidFileType('application/pdf', allowedTypes)).toBe(true);
    });

    it('should reject disallowed file types', () => {
      const allowedTypes = ['image/jpeg', 'image/png'];
      expect(isValidFileType('application/pdf', allowedTypes)).toBe(false);
    });
  });

  describe('isValidCreditCard', () => {
    it('should validate valid credit card numbers', () => {
      expect(isValidCreditCard('4539 1488 0343 6467')).toBe(true);
      expect(isValidCreditCard('4539148803436467')).toBe(true);
    });

    it('should reject invalid credit card numbers', () => {
      expect(isValidCreditCard('1234 5678 9012 3456')).toBe(false);
      expect(isValidCreditCard('abcd efgh ijkl mnop')).toBe(false);
      expect(isValidCreditCard('123456789012')).toBe(false);
    });
  });

  describe('isValidPAN', () => {
    it('should validate valid PAN numbers', () => {
      expect(isValidPAN('ABCDE1234F')).toBe(true);
      expect(isValidPAN('abcde1234f')).toBe(true);
    });

    it('should reject invalid PAN numbers', () => {
      expect(isValidPAN('ABC1234F')).toBe(false);
      expect(isValidPAN('ABCDE123')).toBe(false);
      expect(isValidPAN('ABCDE12345')).toBe(false);
    });
  });

  describe('isValidAadhaar', () => {
    it('should validate valid Aadhaar numbers', () => {
      expect(isValidAadhaar('123456789012')).toBe(true);
      expect(isValidAadhaar('1234 5678 9012')).toBe(true);
    });

    it('should reject invalid Aadhaar numbers', () => {
      expect(isValidAadhaar('12345678901')).toBe(false);
      expect(isValidAadhaar('1234567890123')).toBe(false);
      expect(isValidAadhaar('abcdefghijkl')).toBe(false);
    });
  });

  describe('isValidGST', () => {
    it('should validate valid GST numbers', () => {
      expect(isValidGST('07AAGPG8435F1ZV')).toBe(true);
      expect(isValidGST('07aagpg8435f1zv')).toBe(true);
    });

    it('should reject invalid GST numbers', () => {
      expect(isValidGST('07AAGPG8435F1Z')).toBe(false);
      expect(isValidGST('07AAGPG8435F1ZVV')).toBe(false);
    });
  });
});
