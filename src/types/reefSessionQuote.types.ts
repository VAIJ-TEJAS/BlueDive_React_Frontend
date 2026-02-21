export type SessionPackage = 'Coral Intro' | 'Reef Explorer' | 'Deep Drift';
export type TimingWindow = 'MORNING' | 'AFTERNOON' | 'SUNSET';

export interface ReefSessionQuoteRequest {
  destination: string;
  sessionPackage: SessionPackage;
  timingWindow: TimingWindow;
  participants: number;
  sessions: number;
  includeEquipment: boolean;
  includePhotoPackage: boolean;
  includeInstructorPlus: boolean;
  markupPercent?: number;
  couponCode?: string;
}

export interface ReefSessionQuoteBreakdown {
  baseSessionCost: number;
  timingAdjustment: number;
  equipmentCost: number;
  photoPackageCost: number;
  instructorPlusCost: number;
  markupAmount: number;
  subtotal: number;
  discount: number;
  serviceCharge: number;
  total: number;
}

export interface ReefSessionQuoteResponse {
  quoteId: string;
  generatedAt: string;
  currency: 'INR';
  request: ReefSessionQuoteRequest;
  breakdown: ReefSessionQuoteBreakdown;
  appliedCoupon?: string;
}

export interface ReefSessionQuoteRules {
  basePerParticipantPerSession: Record<SessionPackage, number>;
  timingMultiplier: Record<TimingWindow, number>;
  equipmentPerParticipantPerSession: number;
  photoPackagePerParticipant: number;
  instructorPlusPerSession: number;
  couponDiscountPercent: Record<string, number>;
  maxMarkupPercent: number;
  serviceChargePercent: number;
}

export interface ReefSessionValidationResult {
  valid: boolean;
  errors: string[];
}
