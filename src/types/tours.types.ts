import { IPaxRecord, IPayment } from "./booking-form.types";
import { ITrip } from "./trip.types";

export interface ITour {
    id: number;
    status: 'Partially Confirmed' | 'Confirmed' | 'Cancelled';
    trip: ITrip;
    amount: string;
    balance_amount: string;
    booking_date: string;
    pax_records: IPaxRecord[]; 
    payments: IPayment[];    
    scuba_included: boolean;
    user: number;
}
