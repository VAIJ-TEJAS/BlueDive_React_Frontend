import { describe, it, expect } from 'vitest';
import ItineraryQuoteService from '../utils/itineraryQuoteService';
import { summarizeItineraryQuote } from '../utils/itineraryQuoteFormatter';

describe('itineraryQuotePipeline - P2P', () => {
  it('P2P: preserves singleton instance behavior', () => {
    const a = ItineraryQuoteService.getInstance();
    const b = ItineraryQuoteService.getInstance();

    expect(a).toBe(b);
  });

  it('P2P: returns unique quote ids for sequential calls', () => {
    const service = ItineraryQuoteService.getInstance();

    const one = service.generateQuote({
      destination: 'Goa',
      itineraryType: 'Weekend Getaway',
      travelMonth: 'APR',
      days: 2,
      adults: 2,
      children: 0,
      hotelStars: 3,
      includeBreakfast: false,
      includeTransfers: false,
    });

    const two = service.generateQuote({
      destination: 'Goa',
      itineraryType: 'Weekend Getaway',
      travelMonth: 'APR',
      days: 2,
      adults: 2,
      children: 0,
      hotelStars: 3,
      includeBreakfast: false,
      includeTransfers: false,
    });

    expect(one.success).toBe(true);
    expect(two.success).toBe(true);
    expect(one.data?.quoteId).not.toBe(two.data?.quoteId);
  });

  it('P2P: keeps response contract stable', () => {
    const service = ItineraryQuoteService.getInstance();
    const result = service.generateQuote({
      destination: 'Ladakh',
      itineraryType: 'Adventure Trip',
      travelMonth: 'OCT',
      days: 5,
      adults: 3,
      children: 0,
      hotelStars: 4,
      includeBreakfast: true,
      includeTransfers: true,
    });

    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');

    if (result.success) {
      expect(result.data).toHaveProperty('request');
      expect(result.data).toHaveProperty('breakdown');
      expect(result.data?.breakdown).toHaveProperty('total');

      const summary = summarizeItineraryQuote(result.data!.breakdown);
      expect(summary).toContain('Total:');
      expect(summary.length).toBeGreaterThan(30);
    }
  });
});
