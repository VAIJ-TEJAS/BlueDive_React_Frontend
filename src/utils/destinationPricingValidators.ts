import {
  DestinationPricingRequest,
  DestinationPricingValidationResult,
  SeasonBand,
  StayMode,
} from '../types/destinationPricing.types';

const seasonBands: SeasonBand[] = ['PEAK', 'SHOULDER', 'OFF'];
const stayModes: StayMode[] = ['Economy', 'Comfort', 'Luxury'];

const cleanText = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ');
};

const cleanInt = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.trunc(parsed);
  }
  return 0;
};

const cleanBool = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return v === 'true' || v === 'yes' || v === '1';
  }
  return false;
};

export const normalizeCouponCode = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toUpperCase();
  return normalized.length > 0 ? normalized : undefined;
};

export const sanitizeDestinationPricingRequest = (
  input: Partial<DestinationPricingRequest>
): DestinationPricingRequest => ({
  destination: cleanText(input.destination),
  seasonBand: cleanText(input.seasonBand).toUpperCase() as SeasonBand,
  stayMode: cleanText(input.stayMode) as StayMode,
  nights: cleanInt(input.nights),
  adults: cleanInt(input.adults),
  children: cleanInt(input.children),
  includeLocalTransport: cleanBool(input.includeLocalTransport),
  includeActivities: cleanBool(input.includeActivities),
  markupPercent: typeof input.markupPercent === 'number' ? input.markupPercent : cleanInt(input.markupPercent),
  couponCode: normalizeCouponCode(input.couponCode),
});

export const validateDestinationPricingRequest = (
  request: DestinationPricingRequest
): DestinationPricingValidationResult => {
  const errors: string[] = [];

  if (!request.destination) errors.push('destination is required');
  if (!seasonBands.includes(request.seasonBand)) errors.push('seasonBand must be PEAK, SHOULDER, or OFF');
  if (!stayModes.includes(request.stayMode)) errors.push('stayMode must be Economy, Comfort, or Luxury');

  if (!Number.isInteger(request.nights) || request.nights < 1 || request.nights > 20) {
    errors.push('nights must be an integer between 1 and 20');
  }

  if (!Number.isInteger(request.adults) || request.adults < 1 || request.adults > 8) {
    errors.push('adults must be an integer between 1 and 8');
  }

  if (!Number.isInteger(request.children) || request.children < 0 || request.children > 6) {
    errors.push('children must be an integer between 0 and 6');
  }

  if (request.adults + request.children > 10) {
    errors.push('total travelers cannot exceed 10');
  }

  const markup = request.markupPercent || 0;
  if (markup < 0 || markup > 35) {
    errors.push('markupPercent must be between 0 and 35');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
