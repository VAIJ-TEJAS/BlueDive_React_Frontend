export type MealPlanType = 'Veg Standard' | 'Veg Premium' | 'Mixed Deluxe';
export type MealSeason = 'PEAK' | 'REGULAR' | 'LOW';

export interface MealPlanQuoteRequest {
  destination: string;
  mealPlanType: MealPlanType;
  season: MealSeason;
  days: number;
  adults: number;
  children: number;
  includeWelcomeSnacks: boolean;
  includeDesserts: boolean;
  includeLiveCounter: boolean;
  markupPercent?: number;
  couponCode?: string;
}

export interface MealPlanQuoteRules {
  basePerAdultPerDay: Record<MealPlanType, number>;
  childMultiplier: number;
  seasonMultiplier: Record<MealSeason, number>;
  welcomeSnacksPerPerson: number;
  dessertsPerPersonPerDay: number;
  liveCounterPerDay: number;
  serviceChargePercent: number;
  maxMarkupPercent: number;
  couponDiscountPercent: Record<string, number>;
}

export interface MealPlanQuoteBreakdown {
  baseMealCost: number;
  seasonAdjustment: number;
  snacksCost: number;
  dessertsCost: number;
  liveCounterCost: number;
  markupAmount: number;
  subtotal: number;
  discount: number;
  serviceCharge: number;
  total: number;
}

export interface MealPlanQuoteResponse {
  quoteId: string;
  generatedAt: string;
  currency: 'INR';
  request: MealPlanQuoteRequest;
  breakdown: MealPlanQuoteBreakdown;
  appliedCoupon?: string;
}

export interface MealPlanValidationResult {
  valid: boolean;
  errors: string[];
}
