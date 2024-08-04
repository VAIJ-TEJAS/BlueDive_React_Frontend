interface Package {
    id: number;
    name: string;
    duration: string;
    description?: string;
    days?: Day[];
    events?: Event[];
    pax_options?: PaxOptions[];
    day_records?: DayRecord[];
}

interface Day {
    id: number;
    name: string;
    description?: string;
    package?: Package;
    event_records?: EventRecord[];
    day_records?: DayRecord[];
}

interface Event {
    id: number;
    name: string;
    standard_option?: string;
    description?: string;
    package?: Package;
    options?: Option[];
    event_records?: EventRecord[];
}

interface Option {
    id: number;
    name: string;
    price?: number;
    description?: string;
    event?: Event;
}

interface EventRecord {
    id: number;
    event: Event;
    day: Day;
}

interface DayRecord {
    id: number;
    day: Day;
    package: Package;
}

interface Meal {
    id: number;
    name: string;
}

interface PaxOptions {
    id: number;
    pax: number;
    discount?: number;
    package?: Package;
    meal_records?: MealRecords[];
}

interface MealRecords {
    id: number;
    pax_option: PaxOptions;
    meal: Meal;
    price?: number;
    discounted_price?: number;
}
