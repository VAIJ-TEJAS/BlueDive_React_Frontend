import { describe, it, expect } from 'vitest';
import MealPlanQuoteService from '../utils/mealPlanQuoteService';
import { summarizeMealPlanQuote } from '../utils/mealPlanQuoteFormatter';

describe('mealPlanQuotePipeline - P2P', () => {
  it('P2P: preserves singleton behavior', () => {
    const a = MealPlanQuoteService.getInstance();
    const b = MealPlanQuoteService.getInstance();

    expect(a).toBe(b);
  });

  it('P2P: creates unique quote ids across sequential requests', () => {
    const service = MealPlanQuoteService.getInstance();

    const one = service.generateQuote({
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
    });

    const two = service.generateQuote({
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
    });

    expect(one.success).toBe(true);
    expect(two.success).toBe(true);
    expect(one.data?.quoteId).not.toBe(two.data?.quoteId);
  });

  it('P2P: keeps response contract stable', () => {
    const service = MealPlanQuoteService.getInstance();
    const result = service.generateQuote({
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

    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');

    if (result.success) {
      expect(result.data).toHaveProperty('request');
      expect(result.data).toHaveProperty('breakdown');
      expect(result.data?.breakdown).toHaveProperty('total');

      const summary = summarizeMealPlanQuote(result.data!.breakdown);
      expect(summary).toContain('Total:');
      expect(summary.length).toBeGreaterThan(25);
    }
  });
});
