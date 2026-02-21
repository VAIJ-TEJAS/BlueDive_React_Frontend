import { describe, it, expect } from 'vitest';
import { calculateMealPlanQuoteBreakdown } from '../utils/mealPlanQuoteCalculator';

describe('mealPlanQuoteCalculator - F2P', () => {
  it('F2P: computes PEAK premium quote with all add-ons', () => {
    const result = calculateMealPlanQuoteBreakdown({
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
      couponCode: undefined,
    });

    expect(result.breakdown.baseMealCost).toBe(121440);
    expect(result.breakdown.seasonAdjustment).toBe(24288);
    expect(result.breakdown.snacksCost).toBe(4500);
    expect(result.breakdown.total).toBe(200527.98);
  });

  it('F2P: applies coupon discount correctly', () => {
    const result = calculateMealPlanQuoteBreakdown({
      destination: 'Goa',
      mealPlanType: 'Mixed Deluxe',
      season: 'REGULAR',
      days: 3,
      adults: 15,
      children: 5,
      includeWelcomeSnacks: true,
      includeDesserts: true,
      includeLiveCounter: false,
      markupPercent: 8,
      couponCode: 'DELUXE10',
    });

    expect(result.appliedCoupon).toBe('DELUXE10');
    expect(result.breakdown.discount).toBeGreaterThan(0);
    expect(result.breakdown.total).toBe(112029.8);
  });

  it('F2P: computes LOW season standard quote without optional add-ons', () => {
    const result = calculateMealPlanQuoteBreakdown({
      destination: 'Konkan',
      mealPlanType: 'Veg Standard',
      season: 'LOW',
      days: 5,
      adults: 25,
      children: 0,
      includeWelcomeSnacks: false,
      includeDesserts: false,
      includeLiveCounter: false,
      markupPercent: 0,
      couponCode: undefined,
    });

    expect(result.breakdown.snacksCost).toBe(0);
    expect(result.breakdown.dessertsCost).toBe(0);
    expect(result.breakdown.liveCounterCost).toBe(0);
    expect(result.breakdown.total).toBe(98493.75);
  });

  it('F2P: ignores unknown coupon', () => {
    const result = calculateMealPlanQuoteBreakdown({
      destination: 'Goa',
      mealPlanType: 'Veg Standard',
      season: 'REGULAR',
      days: 2,
      adults: 10,
      children: 0,
      includeWelcomeSnacks: false,
      includeDesserts: false,
      includeLiveCounter: false,
      markupPercent: 0,
      couponCode: 'UNKNOWN',
    });

    expect(result.appliedCoupon).toBeUndefined();
    expect(result.breakdown.discount).toBe(0);
  });
});
