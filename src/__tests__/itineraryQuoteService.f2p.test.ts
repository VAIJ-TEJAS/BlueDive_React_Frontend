import { describe, it, expect } from 'vitest';
import ItineraryQuoteService from '../utils/itineraryQuoteService';

describe('itineraryQuoteService - F2P', () => {
  const service = ItineraryQuoteService.getInstance();

  it('F2P: fails validation for incomplete payload', () => {
    const result = service.generateQuote({ destination: 'Goa' } as any);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Validation failed');
    expect(result.errors).toBeDefined();
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it('F2P: generates valid quote with promo normalization', () => {
    const result = service.generateQuote({
      destination: 'Goa',
      itineraryType: 'Family Vacation',
      travelMonth: 'DEC',
      days: 4,
      adults: 2,
      children: 2,
      hotelStars: 4,
      includeBreakfast: true,
      includeTransfers: true,
      promoCode: 'bluedive10',
    });

    expect(result.success).toBe(true);
    expect(result.data?.quoteId).toMatch(/^ITQ-\d{6}-\d{4}$/);
    expect(result.data?.currency).toBe('INR');
    expect(result.data?.appliedPromo).toBe('BLUEDIVE10');
    expect(result.data?.breakdown.total).toBeGreaterThan(0);
  });

  it('F2P: returns isolated default rules copy', () => {
    const rulesA = service.getDefaultRules();
    const rulesB = service.getDefaultRules();

    rulesA.promoDiscountByCode.NEW = 0.9;

    expect(rulesB.promoDiscountByCode.NEW).toBeUndefined();
    expect(rulesB.basePerDayAdult).toBe(2800);
  });
});
