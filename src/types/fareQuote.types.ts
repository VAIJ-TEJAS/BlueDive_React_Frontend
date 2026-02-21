export type QuoteTripType = 'One-Way Trip' | 'Round Trip' | 'Hourly Rental';

export interface FareQuoteRequest {
  sourceCity: string;
  destinationCity: string;
  tripType: QuoteTripType;
  pickupTime: string;
  distanceKm?: number;
  rentalHours?: number;
  travellers: number;
  luggageUnits: number;
  couponCode?: string;
}

export interface FareQuoteRules {
  perKmRate: number;
  roundTripMultiplier: number;
  hourlyRate: number;
  minimumFare: number;
  luggageSurchargePerUnit: number;
  serviceFeePercent: number;
  nightSurchargePercent: number;
  nightStartHour: number;
  nightEndHour: number;
  surgeMultiplier: number;
  couponDiscounts: Record<string, number>;
}

export interface FareQuoteBreakdown {
  travelFare: number;
  minimumAdjustment: number;
  luggageSurcharge: number;
  nightSurcharge: number;
  surgeSurcharge: number;
  subtotal: number;
  discount: number;
  serviceFee: number;
  total: number;
}

export interface FareQuoteResponse {
  quoteId: string;
  currency: 'INR';
  generatedAt: string;
  appliedCoupon?: string;
  request: FareQuoteRequest;
  breakdown: FareQuoteBreakdown;
}

export interface FareQuoteValidationResult {
  valid: boolean;
  errors: string[];
}
