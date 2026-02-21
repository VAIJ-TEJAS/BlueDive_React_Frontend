import { describe, it, expect } from 'vitest';
import DestinationPricingService from '../utils/destinationPricingService';
import { summarizeDestinationPricing } from '../utils/destinationPricingFormatter';

describe('destinationPricingPipeline - P2P', () => {
  it('P2P: preserves singleton behavior', () => {
    const a = DestinationPricingService.getInstance();
    const b = DestinationPricingService.getInstance();

    expect(a).toBe(b);
  });

  it('P2P: creates distinct quote IDs for sequential calls', () => {
    const service = DestinationPricingService.getInstance();

    const one = service.generateQuote({
      destination: 'Goa',
      seasonBand: 'PEAK',
      stayMode: 'Comfort',
      nights: 2,
      adults: 2,
      children: 0,
      includeLocalTransport: false,
      includeActivities: false,
      markupPercent: 0,
    });

    const two = service.generateQuote({
      destination: 'Goa',
      seasonBand: 'PEAK',
      stayMode: 'Comfort',
      nights: 2,
      adults: 2,
      children: 0,
      includeLocalTransport: false,
      includeActivities: false,
      markupPercent: 0,
    });

    expect(one.success).toBe(true);
    expect(two.success).toBe(true);
    expect(one.data?.quoteId).not.toBe(two.data?.quoteId);
  });

  it('P2P: keeps response contract stable', () => {
    const service = DestinationPricingService.getInstance();
    const result = service.generateQuote({
      destination: 'Konkan',
      seasonBand: 'OFF',
      stayMode: 'Luxury',
      nights: 5,
      adults: 4,
      children: 1,
      includeLocalTransport: true,
      includeActivities: true,
      markupPercent: 12,
    });

    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');

    if (result.success) {
      expect(result.data).toHaveProperty('request');
      expect(result.data).toHaveProperty('breakdown');
      expect(result.data?.breakdown).toHaveProperty('total');

      const summary = summarizeDestinationPricing(result.data!.breakdown);
      expect(summary).toContain('Total:');
      expect(summary.length).toBeGreaterThan(25);
    }
  });
});
