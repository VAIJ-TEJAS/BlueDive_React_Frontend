import { describe, it, expect } from 'vitest';
import {
  normalizeCouponCode,
  sanitizeMealPlanQuoteRequest,
  validateMealPlanQuoteRequest,
} from '../utils/mealPlanQuoteValidators';

describe('mealPlanQuoteValidators - F2P', () => {
  it('F2P: sanitizes payload and normalizes coupon', () => {
    const request = sanitizeMealPlanQuoteRequest({
      destination: '  Goa  ',
      mealPlanType: 'Veg Premium',
      season: 'peak' as any,
      days: '4' as any,
      adults: '20' as any,
      children: '5' as any,
      includeWelcomeSnacks: 'yes' as any,
      includeDesserts: 'true' as any,
      includeLiveCounter: '1' as any,
      markupPercent: '12' as any,
      couponCode: ' family8 ',
    });

    expect(request.destination).toBe('Goa');
    expect(request.season).toBe('PEAK');
    expect(request.days).toBe(4);
    expect(request.adults).toBe(20);
    expect(request.children).toBe(5);
    expect(request.couponCode).toBe('FAMILY8');
  });

  it('F2P: rejects invalid payload values', () => {
    const request = sanitizeMealPlanQuoteRequest({
      destination: '',
      mealPlanType: 'Unknown' as any,
      season: 'MID' as any,
      days: 0,
      adults: 0,
      children: 40,
      includeWelcomeSnacks: false,
      includeDesserts: false,
      includeLiveCounter: false,
      markupPercent: 99,
    });

    const result = validateMealPlanQuoteRequest(request);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('destination is required');
    expect(result.errors).toContain('mealPlanType must be Veg Standard, Veg Premium, or Mixed Deluxe');
    expect(result.errors).toContain('season must be PEAK, REGULAR, or LOW');
    expect(result.errors).toContain('days must be an integer between 1 and 15');
    expect(result.errors).toContain('adults must be an integer between 1 and 50');
    expect(result.errors).toContain('children must be an integer between 0 and 30');
    expect(result.errors).toContain('markupPercent must be between 0 and 25');
  });

  it('F2P: rejects total guests above cap', () => {
    const request = sanitizeMealPlanQuoteRequest({
      destination: 'Goa',
      mealPlanType: 'Veg Standard',
      season: 'REGULAR',
      days: 2,
      adults: 60,
      children: 30,
      includeWelcomeSnacks: false,
      includeDesserts: false,
      includeLiveCounter: false,
      markupPercent: 0,
    });

    const result = validateMealPlanQuoteRequest(request);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('total guests cannot exceed 80');
  });

  it('F2P: accepts valid payload', () => {
    const request = sanitizeMealPlanQuoteRequest({
      destination: 'Konkan',
      mealPlanType: 'Mixed Deluxe',
      season: 'LOW',
      days: 3,
      adults: 12,
      children: 3,
      includeWelcomeSnacks: true,
      includeDesserts: true,
      includeLiveCounter: true,
      markupPercent: 10,
    });

    const result = validateMealPlanQuoteRequest(request);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('F2P: returns undefined for non-string coupon', () => {
    expect(normalizeCouponCode(10 as any)).toBeUndefined();
    expect(normalizeCouponCode(null as any)).toBeUndefined();
  });
});
