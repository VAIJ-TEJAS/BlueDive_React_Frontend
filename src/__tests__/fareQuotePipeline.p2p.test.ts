import { describe, it, expect } from 'vitest';
import FareQuoteService from '../utils/fareQuoteService';
import { summarizeFareQuote } from '../utils/fareQuoteFormatter';

describe('fareQuotePipeline - P2P', () => {
  it('P2P: preserves singleton behavior', () => {
    const a = FareQuoteService.getInstance();
    const b = FareQuoteService.getInstance();

    expect(a).toBe(b);
  });

  it('P2P: emits distinct quote ids for sequential requests', () => {
    const service = FareQuoteService.getInstance();

    const first = service.generateQuote({
      sourceCity: 'Mumbai',
      destinationCity: 'Pune',
      tripType: 'One-Way Trip',
      pickupTime: '09:00',
      distanceKm: 160,
      travellers: 2,
      luggageUnits: 1,
    });

    const second = service.generateQuote({
      sourceCity: 'Mumbai',
      destinationCity: 'Pune',
      tripType: 'One-Way Trip',
      pickupTime: '09:05',
      distanceKm: 161,
      travellers: 2,
      luggageUnits: 1,
    });

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(first.data?.quoteId).not.toBe(second.data?.quoteId);
  });

  it('P2P: keeps response shape stable for valid response', () => {
    const service = FareQuoteService.getInstance();
    const result = service.generateQuote({
      sourceCity: 'Mumbai',
      destinationCity: 'Goa',
      tripType: 'Round Trip',
      pickupTime: '07:20',
      distanceKm: 580,
      travellers: 6,
      luggageUnits: 4,
    });

    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');

    if (result.success) {
      expect(result.data).toHaveProperty('request');
      expect(result.data).toHaveProperty('breakdown');
      expect(result.data?.breakdown).toHaveProperty('total');

      const summary = summarizeFareQuote(result.data!.breakdown);
      expect(summary).toContain('Total:');
      expect(summary.length).toBeGreaterThan(20);
    }
  });
});
