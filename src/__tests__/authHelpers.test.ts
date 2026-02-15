/**
 * Tests for authHelpers utilities
 */

import {
  validatePhoneNumber,
  validateOTP,
  formatPhoneNumber,
  storeUserData,
  getUserData,
  clearUserData,
  getUserDisplayName,
  isUserAuthenticated,
  generateUserInitials,
  maskPhoneNumber,
  validateEmail,
  isTokenExpired,
  type AuthUser,
} from '../utils/authHelpers';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('authHelpers', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('validatePhoneNumber', () => {
    it('should validate correct 10-digit numbers', () => {
      expect(validatePhoneNumber('9876543210')).toBe(true);
      expect(validatePhoneNumber('1234567890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('')).toBe(false);
      expect(validatePhoneNumber('123')).toBe(false);
      expect(validatePhoneNumber('123456789012')).toBe(false);
      expect(validatePhoneNumber('abcdefghij')).toBe(false);
      expect(validatePhoneNumber('98765 43210')).toBe(false);
    });

    it('should handle null/undefined', () => {
      expect(validatePhoneNumber(null as any)).toBe(false);
      expect(validatePhoneNumber(undefined as any)).toBe(false);
    });
  });

  describe('validateOTP', () => {
    it('should validate correct 6-digit OTPs', () => {
      expect(validateOTP('123456')).toBe(true);
      expect(validateOTP('000000')).toBe(true);
    });

    it('should reject invalid OTPs', () => {
      expect(validateOTP('')).toBe(false);
      expect(validateOTP('12345')).toBe(false);
      expect(validateOTP('1234567')).toBe(false);
      expect(validateOTP('abcdef')).toBe(false);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 10-digit numbers correctly', () => {
      expect(formatPhoneNumber('9876543210')).toBe('+91 98765 43210');
      expect(formatPhoneNumber('1234567890')).toBe('+91 12345 67890');
    });

    it('should handle invalid numbers', () => {
      expect(formatPhoneNumber('')).toBe('');
      expect(formatPhoneNumber('123')).toBe('123');
    });
  });

  describe('localStorage operations', () => {
    it('should store and retrieve user data', () => {
      const userData: AuthUser = {
        id: '1',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        token: 'abc123',
      };

      storeUserData(userData);
      const retrieved = getUserData();
      
      expect(retrieved).toEqual(userData);
    });

    it('should handle corrupted localStorage data', () => {
      localStorageMock.setItem('bluedive-user-data', 'invalid-json');
      const retrieved = getUserData();
      
      expect(retrieved).toEqual({});
      expect(localStorageMock.getItem('bluedive-user-data')).toBeNull();
    });

    it('should clear user data', () => {
      storeUserData({ id: '1' });
      clearUserData();
      
      expect(localStorageMock.getItem('bluedive-user-data')).toBeNull();
    });
  });

  describe('getUserDisplayName', () => {
    it('should return initials when first and last name exist', () => {
      const userData: AuthUser = {
        first_name: 'John',
        last_name: 'Doe',
      };
      expect(getUserDisplayName(userData)).toBe('JD');
    });

    it('should return username when no names exist', () => {
      const userData: AuthUser = {
        username: 'johndoe',
      };
      expect(getUserDisplayName(userData)).toBe('johndoe');
    });

    it('should return USER when no data exists', () => {
      expect(getUserDisplayName({})).toBe('USER');
    });
  });

  describe('isUserAuthenticated', () => {
    it('should return true when token and id exist', () => {
      const userData: AuthUser = {
        id: '1',
        token: 'abc123',
      };
      expect(isUserAuthenticated(userData)).toBe(true);
    });

    it('should return false when token or id is missing', () => {
      expect(isUserAuthenticated({ id: '1' })).toBe(false);
      expect(isUserAuthenticated({ token: 'abc123' })).toBe(false);
      expect(isUserAuthenticated({})).toBe(false);
    });
  });

  describe('generateUserInitials', () => {
    it('should generate initials from first and last name', () => {
      expect(generateUserInitials('John', 'Doe')).toBe('JD');
    });

    it('should use first name only when last name is missing', () => {
      expect(generateUserInitials('John', '')).toBe('J');
    });

    it('should return U when no names provided', () => {
      expect(generateUserInitials('', '')).toBe('U');
    });
  });

  describe('maskPhoneNumber', () => {
    it('should mask 10-digit numbers correctly', () => {
      expect(maskPhoneNumber('9876543210')).toBe('+91 98******10');
    });

    it('should handle invalid numbers', () => {
      expect(maskPhoneNumber('')).toBe('');
      expect(maskPhoneNumber('123')).toBe('123');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for no token', () => {
      expect(isTokenExpired()).toBe(true);
      expect(isTokenExpired('')).toBe(true);
    });

    it('should handle invalid tokens', () => {
      expect(isTokenExpired('invalid-token')).toBe(true);
    });

    it('should check token expiration', () => {
      // Create a mock expired token
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 3600 }));
      const signature = 'signature';
      const expiredToken = `${header}.${payload}.${signature}`;
      
      expect(isTokenExpired(expiredToken)).toBe(true);
    });
  });
});
