import { describe, expect, it } from 'vitest';
import ReefSessionQuoteService from '../utils/reefSessionQuoteService';

describe('reefSessionQuoteService - F2P', () => {
  it('F2P: returns validation failure for invalid payload', () => {
    const service = ReefSessionQuoteService.getInstance();

    const result = service.generateQuote({
      destination: 'X',
      sessionPackage: 'Coral Intro',
      timingWindow: 'MORNING',
      participants: 0,
      sessions: 0,
      includeEquipment: false,
      includePhotoPackage: false,
      includeInstructorPlus: false,
      markupPercent: 0,
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Validation failed');
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it('F2P: returns expected structure for valid payload', () => {
    const service = ReefSessionQuoteService.getInstance();

    const result = service.generateQuote({
      destination: 'Goa',
      sessionPackage: 'Reef Explorer',
      timingWindow: 'SUNSET',
      participants: 6,
      sessions: 2,
      includeEquipment: true,
      includePhotoPackage: true,
      includeInstructorPlus: true,
      markupPercent: 12,
      couponCode: 'OCEAN7',
    });

    expect(result.success).toBe(true);
    expect(result.data?.currency).toBe('INR');
    expect(result.data?.quoteId.startsWith('RSQ-')).toBe(true);
    expect(result.data?.breakdown.total).toBeGreaterThan(0);
    expect(result.data?.appliedCoupon).toBe('OCEAN7');
  });

  it('F2P: returns cloned rules object per call', () => {
    const service = ReefSessionQuoteService.getInstance();
    const a = service.getDefaultRules();
    const b = service.getDefaultRules();

    expect(a).not.toBe(b);
    expect(a.basePerParticipantPerSession).not.toBe(b.basePerParticipantPerSession);
    expect(a.maxMarkupPercent).toBe(24);
  });
});
