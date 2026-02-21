import {
  ItineraryQuoteRequest,
  ItineraryType,
  ItineraryValidationResult,
} from '../types/itineraryQuote.types';

const itineraryTypes: ItineraryType[] = ['Weekend Getaway', 'Adventure Trip', 'Family Vacation'];
const validMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const cleanText = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ');
};

const cleanInt = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.trunc(parsed);
  }
  return fallback;
};

const cleanBool = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return v === 'true' || v === '1' || v === 'yes';
  }
  return false;
};

export const normalizePromoCode = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toUpperCase();
  return normalized.length > 0 ? normalized : undefined;
};

export const sanitizeItineraryQuoteRequest = (
  input: Partial<ItineraryQuoteRequest>
): ItineraryQuoteRequest => {
  return {
    destination: cleanText(input.destination),
    itineraryType: (cleanText(input.itineraryType) || 'Weekend Getaway') as ItineraryType,
    travelMonth: cleanText(input.travelMonth).toUpperCase(),
    days: cleanInt(input.days),
    adults: cleanInt(input.adults),
    children: cleanInt(input.children),
    hotelStars: cleanInt(input.hotelStars),
    includeBreakfast: cleanBool(input.includeBreakfast),
    includeTransfers: cleanBool(input.includeTransfers),
    promoCode: normalizePromoCode(input.promoCode),
  };
};

export const validateItineraryQuoteRequest = (
  request: ItineraryQuoteRequest
): ItineraryValidationResult => {
  const errors: string[] = [];

  if (!request.destination) {
    errors.push('destination is required');
  }

  if (!itineraryTypes.includes(request.itineraryType)) {
    errors.push('itineraryType must be Weekend Getaway, Adventure Trip, or Family Vacation');
  }

  if (!validMonths.includes(request.travelMonth)) {
    errors.push('travelMonth must be a valid 3-letter month code');
  }

  if (!Number.isInteger(request.days) || request.days < 1 || request.days > 15) {
    errors.push('days must be an integer between 1 and 15');
  }

  if (!Number.isInteger(request.adults) || request.adults < 1 || request.adults > 8) {
    errors.push('adults must be an integer between 1 and 8');
  }

  if (!Number.isInteger(request.children) || request.children < 0 || request.children > 6) {
    errors.push('children must be an integer between 0 and 6');
  }

  if (!Number.isInteger(request.hotelStars) || ![3, 4, 5].includes(request.hotelStars)) {
    errors.push('hotelStars must be one of: 3, 4, 5');
  }

  if (request.adults + request.children > 10) {
    errors.push('total travelers cannot exceed 10');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
