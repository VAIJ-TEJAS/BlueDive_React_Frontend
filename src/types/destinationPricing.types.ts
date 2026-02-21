export type SeasonBand = 'PEAK' | 'SHOULDER' | 'OFF';
export type StayMode = 'Economy' | 'Comfort' | 'Luxury';

export interface DestinationPricingRequest {
  destination: string;
  seasonBand: SeasonBand;
  stayMode: StayMode;
  nights: number;
  adults: number;
  children: number;
  includeLocalTransport: boolean;
  includeActivities: boolean;
  markupPercent?: number;
  couponCode?: string;
}

export interface DestinationPricingRules {
  baseNightlyByStayMode: Record<StayMode, number>;
  childNightlyMultiplier: number;
  seasonMultiplier: Record<SeasonBand, number>;
  localTransportFlatPerNight: number;
  activitiesFlatPerPerson: number;
  serviceChargePercent: number;
  maxMarkupPercent: number;
  couponDiscountPercent: Record<string, number>;
}

export interface DestinationPricingBreakdown {
  baseStayCost: number;
  seasonAdjustment: number;
  transportCost: number;
  activitiesCost: number;
  markupAmount: number;
  subtotal: number;
  discount: number;
  serviceCharge: number;
  total: number;
}

export interface DestinationPricingResponse {
  quoteId: string;
  generatedAt: string;
  currency: 'INR';
  request: DestinationPricingRequest;
  breakdown: DestinationPricingBreakdown;
  appliedCoupon?: string;
}

export interface DestinationPricingValidationResult {
  valid: boolean;
  errors: string[];
}
