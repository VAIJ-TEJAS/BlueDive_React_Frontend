/**
 * Authentication helper utilities
 */

export interface AuthUser {
  id?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  token?: string;
}

/**
 * Validate Indian phone number (10 digits)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.replace(/\s/g, '');
  return /^\d{10}$/.test(cleanPhone);
};

/**
 * Validate OTP (6 digits)
 */
export const validateOTP = (otp: string): boolean => {
  if (!otp || typeof otp !== 'string') return false;
  return /^\d{6}$/.test(otp);
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone || typeof phone !== 'string') return '';
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
  }
  
  return phone;
};

/**
 * Safely store user data in localStorage
 */
export const storeUserData = (userData: AuthUser): void => {
  try {
    localStorage.setItem('bluedive-user-data', JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Safely retrieve user data from localStorage
 */
export const getUserData = (): AuthUser => {
  try {
    const userData = localStorage.getItem('bluedive-user-data');
    if (!userData) return {};
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    localStorage.removeItem('bluedive-user-data');
    return {};
  }
};

/**
 * Clear user data from localStorage
 */
export const clearUserData = (): void => {
  try {
    localStorage.removeItem('bluedive-user-data');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

/**
 * Get user display name (initials or username)
 */
export const getUserDisplayName = (userData: AuthUser): string => {
  if (userData.first_name && userData.last_name) {
    return `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase();
  }
  return userData.username || 'USER';
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = (userData: AuthUser): boolean => {
  return !!(userData.token && userData.id);
};

/**
 * Generate user initials for avatar
 */
export const generateUserInitials = (firstName?: string, lastName?: string): string => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName[0].toUpperCase();
  }
  return 'U';
};

/**
 * Mask phone number for privacy
 */
export const maskPhoneNumber = (phone: string): string => {
  if (!phone || typeof phone !== 'string') return '';
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return `+91 ${cleanPhone.slice(0, 2)}******${cleanPhone.slice(-2)}`;
  }
  
  return phone;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if token is expired (simple check)
 */
export const isTokenExpired = (token?: string): boolean => {
  if (!token) return true;
  
  try {
    // Simple JWT token check (in production, use proper JWT library)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};
