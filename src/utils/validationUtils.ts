/**
 * Validation utilities
 */

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validates URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates that string contains only letters
 */
export const isAlpha = (str: string): boolean => {
  return /^[a-zA-Z]+$/.test(str);
};

/**
 * Validates that string contains only letters and numbers
 */
export const isAlphanumeric = (str: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(str);
};

/**
 * Validates that string contains only numbers
 */
export const isNumeric = (str: string): boolean => {
  return /^[0-9]+$/.test(str);
};

/**
 * Validates password strength
 */
export const isStrongPassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates Indian PIN code
 */
export const isValidPincode = (pincode: string): boolean => {
  return /^[1-9][0-9]{5}$/.test(pincode);
};

/**
 * Validates that a value is not empty
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validates minimum length
 */
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

/**
 * Validates maximum length
 */
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

/**
 * Validates that a number is within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validates that a date is not in the past
 */
export const isFutureDate = (date: Date | string): boolean => {
  const dateObj = new Date(date);
  return dateObj > new Date();
};

/**
 * Validates that a date is not in the future
 */
export const isPastDate = (date: Date | string): boolean => {
  const dateObj = new Date(date);
  return dateObj < new Date();
};

/**
 * Validates that a date is today
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = new Date(date);
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Validates file size (in bytes)
 */
export const isValidFileSize = (size: number, maxSize: number): boolean => {
  return size <= maxSize;
};

/**
 * Validates file type
 */
export const isValidFileType = (fileType: string, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(fileType);
};

/**
 * Validates credit card number using Luhn algorithm
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(cleaned)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Validates Indian PAN card format
 */
export const isValidPAN = (pan: string): boolean => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
};

/**
 * Validates Aadhaar number (12 digits)
 */
export const isValidAadhaar = (aadhaar: string): boolean => {
  return /^\d{12}$/.test(aadhaar.replace(/\s/g, ''));
};

/**
 * Validates GST number format
 */
export const isValidGST = (gst: string): boolean => {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z][0-9A-Z]{1}$/.test(gst.toUpperCase());
};
