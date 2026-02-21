import {
  GearCategory,
  GearRentalQuoteRequest,
  GearRentalValidationResult,
  DemandBand,
} from '../types/gearRentalQuote.types';

const allowedCategories: GearCategory[] = [
  'Snorkeling Kit',
  'Scuba Basic',
  'Scuba Premium',
  'Kayak Single',
  'Kayak Double',
  'Paddle Board',
];

const allowedDemandBands: DemandBand[] = ['LOW', 'REGULAR', 'PEAK'];

const clampInt = (value: unknown, min: number, max: number): number => {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
};

const normalizeBool = (value: unknown): boolean => value === true;

const normalizeText = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
};

const normalizeCategory = (value: unknown): GearCategory => {
  if (typeof value !== 'string') return 'Snorkeling Kit';
  return (allowedCategories.includes(value as GearCategory) ? value : 'Snorkeling Kit') as GearCategory;
};

const normalizeDemandBand = (value: unknown): DemandBand => {
  if (typeof value !== 'string') return 'REGULAR';
  return (allowedDemandBands.includes(value as DemandBand) ? value : 'REGULAR') as DemandBand;
};

export const sanitizeGearRentalQuoteRequest = (
  input: Partial<GearRentalQuoteRequest>
): GearRentalQuoteRequest => ({
  destination: normalizeText(input.destination, 'Unknown'),
  category: normalizeCategory(input.category),
  demandBand: normalizeDemandBand(input.demandBand),
  days: clampInt(input.days, 1, 14),
  quantity: clampInt(input.quantity, 1, 60),
  includeDelivery: normalizeBool(input.includeDelivery),
  includePickup: normalizeBool(input.includePickup),
  includeSafetyBriefing: normalizeBool(input.includeSafetyBriefing),
  markupPercent: Number.isFinite(Number(input.markupPercent)) ? Number(input.markupPercent) : 0,
  couponCode: typeof input.couponCode === 'string' ? input.couponCode.trim().toUpperCase() : undefined,
});

export const validateGearRentalQuoteRequest = (
  request: GearRentalQuoteRequest
): GearRentalValidationResult => {
  const errors: string[] = [];

  if (!request.destination || request.destination.trim().length < 2) {
    errors.push('Destination must have at least 2 characters.');
  }

  if (!allowedCategories.includes(request.category)) {
    errors.push('Invalid gear category.');
  }

  if (!allowedDemandBands.includes(request.demandBand)) {
    errors.push('Invalid demand band.');
  }

  if (!Number.isInteger(request.days) || request.days < 1 || request.days > 14) {
    errors.push('Days must be an integer between 1 and 14.');
  }

  if (!Number.isInteger(request.quantity) || request.quantity < 1 || request.quantity > 60) {
    errors.push('Quantity must be an integer between 1 and 60.');
  }

  const markup = request.markupPercent || 0;
  if (!Number.isFinite(markup) || markup < 0 || markup > 25) {
    errors.push('Markup percent must be between 0 and 25.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
