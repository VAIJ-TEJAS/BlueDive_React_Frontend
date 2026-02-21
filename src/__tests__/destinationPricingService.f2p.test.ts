import { describe, it, expect } from 'vitest';
import DestinationPricingService from '../utils/destinationPricingService';

describe('destinationPricingService - F2P', () => {
  const service = DestinationPricingService.getInstance();

  it('F2P: fails validation for incomplete payload', () => {
    const result = service.generateQuote({ destination: 'Goa' } as any);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Validation failed');
    expect(result.errors).toBeDefined();
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it('F2P: generates quote for valid payload', () => {
    const result = service.generateQuote({
      destination: 'Goa',
      seasonBand: 'PEAK',
      stayMode: 'Comfort',
      nights: 4,
      adults: 2,
      children: 1,
      includeLocalTransport: true,
      includeActivities: true,
      markupPercent: 10,
      couponCode: 'bluedive8',
    });

    expect(result.success).toBe(true);
    expect(result.data?.quoteId).toMatch(/^DPQ-\d{6}-\d{4}$/);
    expect(result.data?.currency).toBe('INR');
    expect(result.data?.appliedCoupon).toBe('BLUEDIVE8');
    expect(result.data?.breakdown.total).toBeGreaterThan(0);
  });

  it('F2P: returns isolated rules object copies', () => {
    const rulesA = service.getDefaultRules();
    const rulesB = service.getDefaultRules();

    rulesA.couponDiscountPercent.NEWCODE = 0.9;

    expect(rulesB.couponDiscountPercent.NEWCODE).toBeUndefined();
    expect(rulesB.baseNightlyByStayMode.Economy).toBe(2200);
  });
});
