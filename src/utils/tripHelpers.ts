/**
 * Trip status and availability helpers
 */

/**
 * Checks if a trip has available seats
 */
export const hasAvailableSeats = (
  availableSeats: number | null | undefined
): boolean => {
  if (availableSeats === null || availableSeats === undefined) return false;
  return availableSeats > 0;
};

/**
 * Formats available seats with padding
 */
export const formatSeats = (seats: number | null | undefined): string => {
  if (seats === null || seats === undefined || isNaN(seats)) return '00';
  return Math.max(0, seats).toString().padStart(2, '0');
};

/**
 * Gets a user-friendly trip status label
 */
export const getTripStatusLabel = (
  status: string | null | undefined
): string => {
  if (!status) return 'Unknown';
  switch (status) {
    case 'Scheduled': return 'Upcoming';
    case 'Ongoing': return 'In Progress';
    case 'Completed': return 'Completed';
    case 'Cancelled': return 'Cancelled';
    default: return 'Unknown';
  }
};

/**
 * Gets a color class for trip status
 */
export const getTripStatusColor = (
  status: string | null | undefined
): string => {
  if (!status) return 'text-gray-500';
  switch (status) {
    case 'Scheduled': return 'text-blue-500';
    case 'Ongoing': return 'text-green-500';
    case 'Completed': return 'text-gray-500';
    case 'Cancelled': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

/**
 * Checks if a booking can be cancelled based on status
 */
export const isCancellable = (
  status: string | null | undefined
): boolean => {
  if (!status) return false;
  return status === 'Partially Confirmed' || status === 'Confirmed';
};

/**
 * Calculates discount percentage display
 */
export const formatDiscountBadge = (
  percentage: number | null | undefined
): string => {
  if (!percentage || percentage <= 0 || isNaN(percentage)) return '';
  return `${Math.round(percentage)}% Off`;
};
