import {
  MealPlanQuoteRequest,
  MealPlanType,
  MealSeason,
  MealPlanValidationResult,
} from '../types/mealPlanQuote.types';

const planTypes: MealPlanType[] = ['Veg Standard', 'Veg Premium', 'Mixed Deluxe'];
const seasons: MealSeason[] = ['PEAK', 'REGULAR', 'LOW'];

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
    return v === 'true' || v === '1' || v === 'yes';
  }
  return false;
};

export const normalizeCouponCode = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toUpperCase();
  return normalized.length > 0 ? normalized : undefined;
};

export const sanitizeMealPlanQuoteRequest = (
  input: Partial<MealPlanQuoteRequest>
): MealPlanQuoteRequest => ({
  destination: cleanText(input.destination),
  mealPlanType: cleanText(input.mealPlanType) as MealPlanType,
  season: cleanText(input.season).toUpperCase() as MealSeason,
  days: cleanInt(input.days),
  adults: cleanInt(input.adults),
  children: cleanInt(input.children),
  includeWelcomeSnacks: cleanBool(input.includeWelcomeSnacks),
  includeDesserts: cleanBool(input.includeDesserts),
  includeLiveCounter: cleanBool(input.includeLiveCounter),
  markupPercent: typeof input.markupPercent === 'number' ? input.markupPercent : cleanInt(input.markupPercent),
  couponCode: normalizeCouponCode(input.couponCode),
});

export const validateMealPlanQuoteRequest = (
  request: MealPlanQuoteRequest
): MealPlanValidationResult => {
  const errors: string[] = [];

  if (!request.destination) errors.push('destination is required');
  if (!planTypes.includes(request.mealPlanType)) errors.push('mealPlanType must be Veg Standard, Veg Premium, or Mixed Deluxe');
  if (!seasons.includes(request.season)) errors.push('season must be PEAK, REGULAR, or LOW');

  if (!Number.isInteger(request.days) || request.days < 1 || request.days > 15) {
    errors.push('days must be an integer between 1 and 15');
  }

  if (!Number.isInteger(request.adults) || request.adults < 1 || request.adults > 50) {
    errors.push('adults must be an integer between 1 and 50');
  }

  if (!Number.isInteger(request.children) || request.children < 0 || request.children > 30) {
    errors.push('children must be an integer between 0 and 30');
  }

  if (request.adults + request.children > 80) {
    errors.push('total guests cannot exceed 80');
  }

  const markup = request.markupPercent || 0;
  if (markup < 0 || markup > 25) {
    errors.push('markupPercent must be between 0 and 25');
  }

  return { valid: errors.length === 0, errors };
};
