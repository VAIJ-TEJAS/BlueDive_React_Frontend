import { IPackage } from "./package.types";

export interface ITrip {
    id: number;
    start_date: string; 
    end_date: string;
    available_seats: number;
    available_rooms: number; 
    status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';
    package: IPackage;
    is_scuba_free: boolean; // Indicates if scuba diving is free based on the limit
    scuba_free_until_date: string | null; // Date till which scuba diving is free
    is_discount_applicable: boolean; // Indicates if a discount is applicable based on the limit
    discount_applicable_until_date: string | null; // Date till which the discount is applicable
    can_do_advance_payment: boolean; // Indicates if advance payment can be made
    advance_payment_due_date: string | null; // Due date for advance payment if applicable
}
