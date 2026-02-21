import { describe, expect, it } from 'vitest';
import GearRentalQuoteService from '../utils/gearRentalQuoteService';

describe('gearRentalQuoteService - F2P', () => {
  it('F2P: returns validation failure for bad input', () => {
    const service = GearRentalQuoteService.getInstance();

    const result = service.generateQuote({
      destination: 'X',
      category: 'Scuba Basic',
      demandBand: 'REGULAR',
      days: 0,
      quantity: 1,
      includeDelivery: false,
      includePickup: false,
      includeSafetyBriefing: false,
      markupPercent: 0,
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Validation failed');
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it('F2P: generates a complete response for valid input', () => {
    const service = GearRentalQuoteService.getInstance();

    const result = service.generateQuote({
      destination: 'Goa',
      category: 'Paddle Board',
      demandBand: 'PEAK',
      days: 3,
      quantity: 2,
      includeDelivery: true,
      includePickup: true,
      includeSafetyBriefing: true,
      markupPercent: 8,
      couponCode: 'OCEAN8',
    });

    expect(result.success).toBe(true);
    expect(result.data?.currency).toBe('INR');
    expect(result.data?.quoteId.startsWith('GRQ-')).toBe(true);
    expect(result.data?.breakdown.total).toBeGreaterThan(0);
    expect(result.data?.appliedCoupon).toBe('OCEAN8');
  });

  it('F2P: exposes default rules as a clone', () => {
    const service = GearRentalQuoteService.getInstance();
    const rulesA = service.getDefaultRules();
    const rulesB = service.getDefaultRules();

    expect(rulesA).not.toBe(rulesB);
    expect(rulesA.basePerUnitPerDay).not.toBe(rulesB.basePerUnitPerDay);
    expect(rulesA.maxMarkupPercent).toBe(25);
  });
});
