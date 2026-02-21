import { describe, it, expect } from 'vitest';
import { calculateDestinationPricingBreakdown } from '../utils/destinationPricingCalculator';

describe('destinationPricingCalculator - F2P', () => {
  it('F2P: computes PEAK comfort quote with extras and markup', () => {
    const result = calculateDestinationPricingBreakdown({
      destination: 'Goa',
      seasonBand: 'PEAK',
      stayMode: 'Comfort',
      nights: 4,
      adults: 2,
      children: 1,
      includeLocalTransport: true,
      includeActivities: true,
      markupPercent: 10,
      couponCode: undefined,
    });

    expect(result.breakdown.baseStayCost).toBe(36000);
    expect(result.breakdown.seasonAdjustment).toBe(9000);
    expect(result.breakdown.transportCost).toBe(3600);
    expect(result.breakdown.activitiesCost).toBe(4200);
    expect(result.breakdown.total).toBe(59822.4);
  });

  it('F2P: applies coupon discount correctly', () => {
    const result = calculateDestinationPricingBreakdown({
      destination: 'Goa',
      seasonBand: 'SHOULDER',
      stayMode: 'Luxury',
      nights: 3,
      adults: 2,
      children: 2,
      includeLocalTransport: true,
      includeActivities: true,
      markupPercent: 8,
      couponCode: 'FAMILY10',
    });

    expect(result.appliedCoupon).toBe('FAMILY10');
    expect(result.breakdown.discount).toBeGreaterThan(0);
    expect(result.breakdown.total).toBe(66967.59);
  });

  it('F2P: computes OFF season economy quote without extras', () => {
    const result = calculateDestinationPricingBreakdown({
      destination: 'Konkan',
      seasonBand: 'OFF',
      stayMode: 'Economy',
      nights: 5,
      adults: 3,
      children: 0,
      includeLocalTransport: false,
      includeActivities: false,
      markupPercent: 0,
      couponCode: undefined,
    });

    expect(result.breakdown.transportCost).toBe(0);
    expect(result.breakdown.activitiesCost).toBe(0);
    expect(result.breakdown.markupAmount).toBe(0);
    expect(result.breakdown.total).toBe(29911.2);
  });

  it('F2P: ignores unknown coupon code', () => {
    const result = calculateDestinationPricingBreakdown({
      destination: 'Goa',
      seasonBand: 'SHOULDER',
      stayMode: 'Economy',
      nights: 2,
      adults: 2,
      children: 0,
      includeLocalTransport: false,
      includeActivities: false,
      markupPercent: 0,
      couponCode: 'UNKNOWN',
    });

    expect(result.appliedCoupon).toBeUndefined();
    expect(result.breakdown.discount).toBe(0);
  });
});
