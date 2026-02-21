import { describe, it, expect } from 'vitest';
import FareQuoteService from '../utils/fareQuoteService';

describe('fareQuoteService - F2P', () => {
  const service = FareQuoteService.getInstance();

  it('F2P: fails with validation errors for incomplete payload', () => {
    const result = service.generateQuote({
      sourceCity: 'Mumbai',
    } as any);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Validation failed');
    expect(result.errors).toBeDefined();
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it('F2P: generates a valid quote with normalized coupon', () => {
    const result = service.generateQuote({
      sourceCity: 'Mumbai',
      destinationCity: 'Nashik',
      tripType: 'One-Way Trip',
      pickupTime: '10:20',
      distanceKm: 170,
      travellers: 4,
      luggageUnits: 3,
      couponCode: 'save15',
    });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.quoteId).toMatch(/^BDQ-\d{6}-\d{4}$/);
    expect(result.data?.currency).toBe('INR');
    expect(result.data?.appliedCoupon).toBe('SAVE15');
    expect(result.data?.breakdown.total).toBeGreaterThan(0);
  });

  it('F2P: returns cloned rule objects', () => {
    const rulesA = service.getDefaultRules();
    const rulesB = service.getDefaultRules();

    rulesA.couponDiscounts.NEWCODE = 0.5;

    expect(rulesB.couponDiscounts.NEWCODE).toBeUndefined();
    expect(rulesB.minimumFare).toBe(500);
  });
});
