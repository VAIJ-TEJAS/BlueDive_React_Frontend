import { describe, expect, it } from 'vitest';
import ReefSessionQuoteService from '../utils/reefSessionQuoteService';
import { summarizeReefSessionQuote } from '../utils/reefSessionQuoteFormatter';

describe('reefSessionQuotePipeline - P2P', () => {
  it('P2P: preserves singleton behavior', () => {
    const a = ReefSessionQuoteService.getInstance();
    const b = ReefSessionQuoteService.getInstance();
    expect(a).toBe(b);
  });

  it('P2P: generates distinct quote ids sequentially', () => {
    const service = ReefSessionQuoteService.getInstance();

    const one = service.generateQuote({
      destination: 'Goa',
      sessionPackage: 'Coral Intro',
      timingWindow: 'MORNING',
      participants: 3,
      sessions: 1,
      includeEquipment: false,
      includePhotoPackage: false,
      includeInstructorPlus: false,
      markupPercent: 0,
    });

    const two = service.generateQuote({
      destination: 'Goa',
      sessionPackage: 'Coral Intro',
      timingWindow: 'MORNING',
      participants: 3,
      sessions: 1,
      includeEquipment: false,
      includePhotoPackage: false,
      includeInstructorPlus: false,
      markupPercent: 0,
    });

    expect(one.success).toBe(true);
    expect(two.success).toBe(true);
    expect(one.data?.quoteId).not.toBe(two.data?.quoteId);
  });

  it('P2P: maintains response contract and summary', () => {
    const service = ReefSessionQuoteService.getInstance();

    const result = service.generateQuote({
      destination: 'Konkan',
      sessionPackage: 'Deep Drift',
      timingWindow: 'AFTERNOON',
      participants: 4,
      sessions: 2,
      includeEquipment: true,
      includePhotoPackage: true,
      includeInstructorPlus: true,
      markupPercent: 9,
      couponCode: 'REEF5',
    });

    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('message');

    if (result.success) {
      expect(result.data).toHaveProperty('request');
      expect(result.data).toHaveProperty('breakdown');
      expect(result.data?.breakdown).toHaveProperty('total');

      const summary = summarizeReefSessionQuote(result.data!.breakdown);
      expect(summary).toContain('Total:');
      expect(summary.length).toBeGreaterThan(25);
    }
  });
});
