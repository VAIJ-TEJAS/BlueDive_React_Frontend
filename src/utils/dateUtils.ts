/**
 * Date formatting utilities
 */

/**
 * Formats a date to a readable string
 */
export const formatDate = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Formats a date to include time
 */
export const formatDateTime = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formats time to readable string
 */
export const formatTime = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Gets relative time (e.g., "2 hours ago", "3 days ago")
 */
export const getRelativeTime = (date: Date | string | number): string => {
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(dateObj);
};

/**
 * Checks if a date is today
 */
export const isToday = (date: Date | string | number): boolean => {
  const dateObj = new Date(date);
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Checks if a date is yesterday
 */
export const isYesterday = (date: Date | string | number): boolean => {
  const dateObj = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateObj.toDateString() === yesterday.toDateString();
};

/**
 * Adds days to a date
 */
export const addDays = (date: Date | string | number, days: number): Date => {
  const dateObj = new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};

/**
 * Subtracts days from a date
 */
export const subtractDays = (date: Date | string | number, days: number): Date => {
  return addDays(date, -days);
};

/**
 * Gets the start of day for a given date
 */
export const startOfDay = (date: Date | string | number): Date => {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
};

/**
 * Gets the end of day for a given date
 */
export const endOfDay = (date: Date | string | number): Date => {
  const dateObj = new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
};
