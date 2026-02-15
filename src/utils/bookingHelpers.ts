import { IPaxRecord, Status } from '../types/booking-form.types';

export const calculateTotalCost = (paxRecords: IPaxRecord[]): number => {
    return paxRecords.reduce((total, record) => {
        const recordTotal = record.customer_details.reduce(
            (sum, detail) => sum + (detail.package_cost || 0),
            0
        );
        return total + recordTotal;
    }, 0);
};

export const calculateDiscountedTotal = (paxRecords: IPaxRecord[]): number => {
    return paxRecords.reduce((total, record) => {
        const recordTotal = record.customer_details.reduce(
            (sum, detail) => sum + (detail.discounted_package_cost || 0),
            0
        );
        return total + recordTotal;
    }, 0);
};

export const getTotalPax = (paxRecords: IPaxRecord[]): number => {
    return paxRecords.reduce((total, record) => total + record.customer_details.length, 0);
};

export const getStatusLabel = (status: Status): string => {
    switch (status) {
        case 'Confirmed':
            return 'Booking Confirmed';
        case 'Partially Confirmed':
            return 'Awaiting Full Payment';
        case 'Cancelled':
            return 'Booking Cancelled';
        default:
            return 'Unknown Status';
    }
};

export const isBookingEditable = (status: Status): boolean => {
    return status !== 'Cancelled';
};

export const getAdvanceAmount = (totalPax: number, advancePerPax: number = 2500): number => {
    return totalPax * advancePerPax;
};
