/**
 * Date formatting and validation utilities
 */

/**
 * Formats a date string to display format (DD MMM YY)
 */
export const formatDisplayDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid Date';
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);
  return `${day} ${month} ${year}`;
};

/**
 * Formats a date range for trip display
 */
export const formatDateRange = (
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string => {
  if (!startDate || !endDate) return '';
  const start = formatDisplayDate(startDate);
  const end = formatDisplayDate(endDate);
  if (start === 'Invalid Date' || end === 'Invalid Date') return '';
  return `${start} - ${end}`;
};

/**
 * Checks if a date is in the past
 */
export const isDatePast = (dateStr: string | null | undefined): boolean => {
  if (!dateStr) return true;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Calculates days until a given date
 */
export const daysUntil = (dateStr: string | null | undefined): number => {
  if (!dateStr) return 0;
  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Formats trip duration from start and end dates
 */
export const getTripDuration = (
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string => {
  if (!startDate || !endDate) return '';
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return '';
  if (days === 1) return '1 day';
  return `${days} days`;
};
