import { describe, it, expect } from 'vitest';
import GearRentalQuoteService from '../utils/gearRentalQuoteService';
import { summarizeGearRentalQuote } from '../utils/gearRentalQuoteFormatter';

describe('gearRentalQuotePipeline - P2P', () => {
  it('P2P: preserves singleton behavior', () => {
    const a = GearRentalQuoteService.getInstance();
    const b = GearRentalQuoteService.getInstance();

    expect(a).toBe(b);
  });

  it('P2P: creates unique quote ids across sequential requests', () => {
    const service = GearRentalQuoteService.getInstance();

    const one = service.generateQuote({
      destination: 'Goa',
      category: 'Scuba Basic',
      demandBand: 'REGULAR',
      days: 2,
      quantity: 3,
      includeDelivery: false,
      includePickup: false,
      includeSafetyBriefing: false,
      markupPercent: 0,
    });

    const two = service.generateQuote({
      destination: 'Goa',
      category: 'Scuba Basic',
      demandBand: 'REGULAR',
      days: 2,
      quantity: 3,
      includeDelivery: false,
      includePickup: false,
      includeSafetyBriefing: false,
      markupPercent: 0,
    });

    expect(one.success).toBe(true);
    expect(two.success).toBe(true);
    expect(one.data?.quoteId).not.toBe(two.data?.quoteId);
  });

  it('P2P: keeps response contract stable', () => {
    const service = GearRentalQuoteService.getInstance();
    const result = service.generateQuote({
      destination: 'Konkan',
      category: 'Kayak Single',
      demandBand: 'LOW',
      days: 2,
      quantity: 4,
      includeDelivery: true,
      includePickup: true,
      includeSafetyBriefing: true,
      markupPercent: 7,
      couponCode: 'DIVE5',
    });

    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');

    if (result.success) {
      expect(result.data).toHaveProperty('request');
      expect(result.data).toHaveProperty('breakdown');
      expect(result.data?.breakdown).toHaveProperty('total');

      const summary = summarizeGearRentalQuote(result.data!.breakdown);
      expect(summary).toContain('Total:');
      expect(summary.length).toBeGreaterThan(25);
    }
  });
});
