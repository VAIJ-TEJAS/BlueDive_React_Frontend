export type GearCategory =
  | 'Snorkeling Kit'
  | 'Scuba Basic'
  | 'Scuba Premium'
  | 'Kayak Single'
  | 'Kayak Double'
  | 'Paddle Board';

export type DemandBand = 'LOW' | 'REGULAR' | 'PEAK';

export interface GearRentalQuoteRequest {
  destination: string;
  category: GearCategory;
  demandBand: DemandBand;
  days: number;
  quantity: number;
  includeDelivery: boolean;
  includePickup: boolean;
  includeSafetyBriefing: boolean;
  markupPercent?: number;
  couponCode?: string;
}

export interface GearRentalQuoteBreakdown {
  baseRentalCost: number;
  demandAdjustment: number;
  deliveryCost: number;
  pickupCost: number;
  safetyBriefingCost: number;
  markupAmount: number;
  subtotal: number;
  discount: number;
  platformFee: number;
  total: number;
}

export interface GearRentalQuoteResponse {
  quoteId: string;
  generatedAt: string;
  currency: 'INR';
  request: GearRentalQuoteRequest;
  breakdown: GearRentalQuoteBreakdown;
  appliedCoupon?: string;
}

export interface GearRentalQuoteRules {
  basePerUnitPerDay: Record<GearCategory, number>;
  demandMultiplier: Record<DemandBand, number>;
  deliveryPerUnit: number;
  pickupPerUnit: number;
  safetyBriefingPerBooking: number;
  couponDiscountPercent: Record<string, number>;
  maxMarkupPercent: number;
  platformFeePercent: number;
}

export interface GearRentalValidationResult {
  valid: boolean;
  errors: string[];
}
