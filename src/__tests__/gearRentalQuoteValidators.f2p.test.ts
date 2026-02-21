import { describe, expect, it } from 'vitest';
import {
  sanitizeGearRentalQuoteRequest,
  validateGearRentalQuoteRequest,
} from '../utils/gearRentalQuoteValidators';

describe('gearRentalQuoteValidators - F2P', () => {
  it('F2P: sanitizes invalid inputs into a safe request', () => {
    const sanitized = sanitizeGearRentalQuoteRequest({
      destination: ' ',
      category: 'Invalid' as never,
      demandBand: 'X' as never,
      days: -2,
      quantity: 999,
      includeDelivery: 'yes' as never,
      includePickup: 1 as never,
      includeSafetyBriefing: null as never,
      markupPercent: 50,
      couponCode: ' dive5 ',
    });

    expect(sanitized.destination).toBe('Unknown');
    expect(sanitized.category).toBe('Snorkeling Kit');
    expect(sanitized.demandBand).toBe('REGULAR');
    expect(sanitized.days).toBe(1);
    expect(sanitized.quantity).toBe(60);
    expect(sanitized.includeDelivery).toBe(false);
    expect(sanitized.includePickup).toBe(false);
    expect(sanitized.includeSafetyBriefing).toBe(false);
    expect(sanitized.markupPercent).toBe(50);
    expect(sanitized.couponCode).toBe('DIVE5');
  });

  it('F2P: validates a valid request successfully', () => {
    const result = validateGearRentalQuoteRequest(
      sanitizeGearRentalQuoteRequest({
        destination: 'Goa',
        category: 'Scuba Basic',
        demandBand: 'PEAK',
        days: 3,
        quantity: 4,
        includeDelivery: true,
        includePickup: true,
        includeSafetyBriefing: true,
        markupPercent: 12,
      })
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('F2P: reports validation errors for out-of-range fields', () => {
    const result = validateGearRentalQuoteRequest({
      destination: 'A',
      category: 'Scuba Premium',
      demandBand: 'LOW',
      days: 0,
      quantity: 0,
      includeDelivery: false,
      includePickup: false,
      includeSafetyBriefing: false,
      markupPercent: 30,
      couponCode: undefined,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Destination must have at least 2 characters.');
    expect(result.errors).toContain('Days must be an integer between 1 and 14.');
    expect(result.errors).toContain('Quantity must be an integer between 1 and 60.');
    expect(result.errors).toContain('Markup percent must be between 0 and 25.');
  });
});
