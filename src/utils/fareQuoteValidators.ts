import {
  FareQuoteRequest,
  FareQuoteValidationResult,
  QuoteTripType,
} from '../types/fareQuote.types';

const TRIP_TYPES: QuoteTripType[] = ['One-Way Trip', 'Round Trip', 'Hourly Rental'];

const is24HourTime = (value: string): boolean => {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
};

const cleanText = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ');
};

const cleanInteger = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.trunc(parsed);
    }
  }

  return 0;
};

const cleanDecimal = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

export const normalizeCoupon = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toUpperCase();
  return normalized.length > 0 ? normalized : undefined;
};

export const sanitizeFareQuoteRequest = (
  input: Partial<FareQuoteRequest>
): FareQuoteRequest => {
  return {
    sourceCity: cleanText(input.sourceCity),
    destinationCity: cleanText(input.destinationCity),
    tripType: (cleanText(input.tripType) || 'One-Way Trip') as QuoteTripType,
    pickupTime: cleanText(input.pickupTime),
    distanceKm: cleanDecimal(input.distanceKm),
    rentalHours: cleanDecimal(input.rentalHours),
    travellers: cleanInteger(input.travellers),
    luggageUnits: cleanInteger(input.luggageUnits),
    couponCode: normalizeCoupon(input.couponCode),
  };
};

export const validateFareQuoteRequest = (
  request: FareQuoteRequest
): FareQuoteValidationResult => {
  const errors: string[] = [];

  if (!request.sourceCity) {
    errors.push('sourceCity is required');
  }

  if (!request.destinationCity) {
    errors.push('destinationCity is required');
  }

  if (request.tripType === 'One-Way Trip' && request.sourceCity === request.destinationCity) {
    errors.push('sourceCity and destinationCity must differ for one-way trip');
  }

  if (!TRIP_TYPES.includes(request.tripType)) {
    errors.push('tripType is invalid');
  }

  if (!is24HourTime(request.pickupTime)) {
    errors.push('pickupTime must be HH:MM in 24-hour format');
  }

  if (!Number.isInteger(request.travellers) || request.travellers < 1 || request.travellers > 12) {
    errors.push('travellers must be an integer between 1 and 12');
  }

  if (!Number.isInteger(request.luggageUnits) || request.luggageUnits < 0 || request.luggageUnits > 20) {
    errors.push('luggageUnits must be an integer between 0 and 20');
  }

  if (request.tripType === 'Hourly Rental') {
    if (typeof request.rentalHours !== 'number' || request.rentalHours <= 0) {
      errors.push('rentalHours must be greater than 0 for hourly rental');
    }

    if (typeof request.rentalHours === 'number' && request.rentalHours > 24) {
      errors.push('rentalHours cannot exceed 24');
    }
  } else {
    if (typeof request.distanceKm !== 'number' || request.distanceKm <= 0) {
      errors.push('distanceKm must be greater than 0 for trip type');
    }

    if (typeof request.distanceKm === 'number' && request.distanceKm > 3000) {
      errors.push('distanceKm cannot exceed 3000');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
