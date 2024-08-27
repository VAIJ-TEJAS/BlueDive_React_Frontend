import { ITrip } from "./trip.types";

export interface ITour {
    id: number;
    status: 'Partially Confirmed' | 'Confirmed' | 'Cancelled';
    trip: ITrip;
}
