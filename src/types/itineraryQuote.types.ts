export type ItineraryType = 'Weekend Getaway' | 'Adventure Trip' | 'Family Vacation';

export interface ItineraryQuoteRequest {
  destination: string;
  itineraryType: ItineraryType;
  travelMonth: string;
  days: number;
  adults: number;
  children: number;
  hotelStars: number;
  includeBreakfast: boolean;
  includeTransfers: boolean;
  promoCode?: string;
}

export interface ItineraryQuoteRules {
  basePerDayAdult: number;
  childMultiplier: number;
  weekendMultiplier: number;
  adventureMultiplier: number;
  familyMultiplier: number;
  starSurchargeByHotel: Record<number, number>;
  breakfastPerPersonPerDay: number;
  transfersFlatFee: number;
  seasonalMultiplierByMonth: Record<string, number>;
  serviceFeePercent: number;
  promoDiscountByCode: Record<string, number>;
}

export interface ItineraryQuoteBreakdown {
  basePackage: number;
  itineraryAdjustment: number;
  hotelSurcharge: number;
  breakfastCost: number;
  transferCost: number;
  seasonalAdjustment: number;
  subtotal: number;
  discount: number;
  serviceFee: number;
  total: number;
}

export interface ItineraryQuoteResponse {
  quoteId: string;
  generatedAt: string;
  currency: 'INR';
  request: ItineraryQuoteRequest;
  breakdown: ItineraryQuoteBreakdown;
  appliedPromo?: string;
}

export interface ItineraryValidationResult {
  valid: boolean;
  errors: string[];
}
