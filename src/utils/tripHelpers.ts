export type TripStatus = 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';

export const isTripBookable = (status: TripStatus, availableSeats: number): boolean => {
    return status === 'Scheduled' && availableSeats > 0;
};

export const getTripStatusColor = (status: TripStatus): string => {
    switch (status) {
        case 'Scheduled':
            return 'green';
        case 'Ongoing':
            return 'blue';
        case 'Completed':
            return 'gray';
        case 'Cancelled':
            return 'red';
        default:
            return 'gray';
    }
};

export const formatTripDateRange = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';

    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const startStr = start.toLocaleDateString('en-IN', opts);
    const endStr = end.toLocaleDateString('en-IN', { ...opts, year: 'numeric' });
    return `${startStr} - ${endStr}`;
};

export const getTripDurationDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffMs = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

export const isTripUpcoming = (startDate: string): boolean => {
    if (!startDate) return false;
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return false;
    return start.getTime() > Date.now();
};

export const getSeatsLabel = (seats: number): string => {
    if (seats <= 0) return 'Fully Booked';
    if (seats === 1) return '1 seat left';
    if (seats <= 5) return `Only ${seats} seats left`;
    return `${seats} seats available`;
};
