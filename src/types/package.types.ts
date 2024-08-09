import { ITrip } from "./trip.types";

export interface IPackage {
    id: number;
    name: string;
    duration?: string;
    description?: string;
    cover_image?: string;
    display_price?: number | null;
    display_discount_percentage?: number | null;
    day_records?: IDayRecord[];
    pax_options?: IPaxOptions[];
    meal_records?: IMealRecords[];
    vehicle?: IVehicle;
    accommodation?: IAccommodation;
    trips?: ITrip[]; 
}

export interface IDay {
    id: number;
    name: string;
    description?: string;
    package?: IPackage;
    event_records?: IEventRecord[];
    day_records?: IDayRecord[];
}

export interface IEvent {
    id: number;
    name: string;
    standard_option?: string;
    description?: string;
    package?: IPackage;
    options?: IOption[];
    event_records?: IEventRecord[];
}

export interface IOption {
    id: number;
    name: string;
    price?: number;
    description?: string;
    event?: IEvent;
}

export interface IEventRecord {
    id: number;
    event: IEvent;
    day: IDay;
}

export interface IDayRecord {
    id: number;
    day: IDay;
    package: IPackage;
}

export interface IMeal {
    id: number;
    name: string;
}

export interface IPaxOptions {
    id: number;
    pax: number;
    discount?: number;
    package?: IPackage;
    meal_records?: IMealRecords[];
}

export interface IMealRecords {
    id: number;
    pax_option: IPaxOptions;
    meal: IMeal;
    price?: number;
    discounted_price?: number;
}

export interface IVehicle {
    id: number;
    name: string;
    details?: string;
    images?: IVehicleImage[];
}

export interface IVehicleImage {
    id: number;
    vehicle: IVehicle;
    image: string;
}

export interface IAccommodation {
    id: number;
    name: string;
    details?: string;
    images?: IAccommodationImage[];
}

export interface IAccommodationImage {
    id: number;
    accommodation: IAccommodation;
    image: string;
}
