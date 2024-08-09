import { IPackage } from "./package.types";

export interface ITrip {
    id: number;
    start_date: string; 
    end_date: string;
    available_seats: number;
    status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';
    package: IPackage;
}
