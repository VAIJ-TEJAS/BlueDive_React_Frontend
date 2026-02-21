import { describe, it, expect } from 'vitest';
import MealPlanQuoteService from '../utils/mealPlanQuoteService';

describe('mealPlanQuoteService - F2P', () => {
  const service = MealPlanQuoteService.getInstance();

  it('F2P: fails validation for incomplete payload', () => {
    const result = service.generateQuote({ destination: 'Goa' } as any);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Validation failed');
    expect(result.errors).toBeDefined();
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it('F2P: generates valid quote for complete payload', () => {
    const result = service.generateQuote({
      destination: 'Goa',
      mealPlanType: 'Veg Premium',
      season: 'PEAK',
      days: 4,
      adults: 20,
      children: 5,
      includeWelcomeSnacks: true,
      includeDesserts: true,
      includeLiveCounter: true,
      markupPercent: 12,
      couponCode: 'family8',
    });

    expect(result.success).toBe(true);
    expect(result.data?.quoteId).toMatch(/^MPQ-\d{6}-\d{4}$/);
    expect(result.data?.currency).toBe('INR');
    expect(result.data?.appliedCoupon).toBe('FAMILY8');
    expect(result.data?.breakdown.total).toBeGreaterThan(0);
  });

  it('F2P: returns isolated rules object copy', () => {
    const a = service.getDefaultRules();
    const b = service.getDefaultRules();

    a.couponDiscountPercent.NEW = 0.9;

    expect(b.couponDiscountPercent.NEW).toBeUndefined();
    expect(b.basePerAdultPerDay['Veg Standard']).toBe(850);
  });
});
