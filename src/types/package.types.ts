import { ITrip } from "./trip.types";

export interface IPackage {
    id: number;
    name: string;
    duration?: string;
    description?: string;
    cover_image?: string;
    images?: IPackageImages[];
    display_price?: number | null;
    display_discount_percentage?: number | null;
    day_records?: IDayRecord[];
    pax_options?: IPaxOptions[];
    meal_records?: IMealRecords[];
    meals?: IMeal[]; 
    default_meal_option?: IMeal;
    vehicle?: IVehicle;
    accommodation?: IAccommodation;
    trips?: ITrip[];
    pickup_points?: IPickupPoint[]; 
    water_sport_options?: IWaterSportOption[]; 
}

export interface IPackageImages {
    id: number; 
    package: number; 
    image: string; 
}

export interface IDay {
    id: number;
    name: string;
    description?: string;
    package?: IPackage;
    event_records?: IEventRecord[];
    day_records?: IDayRecord[];
    food_records?: IFoodRecord[];
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
    description: string;
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

export interface IPickupPoint {
    id: number;
    name: string;
    location: string;
}

export interface IWaterSportOption {
    id: number;
    name: string;
}

export interface IFoodOption {
    id: number;
    name: string;
}

export interface IMealFoodRecord {
    id: number;
    food_record: IFoodRecord;
    food_options: IFoodOption[];
    meal_type: 'lunch' | 'dinner';
}

export interface IFoodRecord {
    id: number;
    meal: IMeal;
    meal_food_records: IMealFoodRecord[];
}