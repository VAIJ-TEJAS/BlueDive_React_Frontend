import { describe, expect, it } from 'vitest';
import { calculateReefSessionQuoteBreakdown } from '../utils/reefSessionQuoteCalculator';

describe('reefSessionQuoteCalculator - F2P', () => {
  it('F2P: computes totals with add-ons and coupon', () => {
    const { breakdown, appliedCoupon } = calculateReefSessionQuoteBreakdown({
      destination: 'Goa',
      sessionPackage: 'Deep Drift',
      timingWindow: 'SUNSET',
      participants: 5,
      sessions: 2,
      includeEquipment: true,
      includePhotoPackage: true,
      includeInstructorPlus: true,
      markupPercent: 10,
      couponCode: 'DIVE9',
    });

    expect(appliedCoupon).toBe('DIVE9');
    expect(breakdown.baseSessionCost).toBe(31000);
    expect(breakdown.timingAdjustment).toBe(4650);
    expect(breakdown.equipmentCost).toBe(1800);
    expect(breakdown.photoPackageCost).toBe(1750);
    expect(breakdown.instructorPlusCost).toBe(1800);
    expect(breakdown.markupAmount).toBe(4100);
    expect(breakdown.subtotal).toBe(45100);
    expect(breakdown.discount).toBe(4059);
    expect(breakdown.serviceCharge).toBe(1231.23);
    expect(breakdown.total).toBe(42272.23);
  });

  it('F2P: computes baseline values without options', () => {
    const { breakdown, appliedCoupon } = calculateReefSessionQuoteBreakdown({
      destination: 'Konkan',
      sessionPackage: 'Coral Intro',
      timingWindow: 'MORNING',
      participants: 3,
      sessions: 1,
      includeEquipment: false,
      includePhotoPackage: false,
      includeInstructorPlus: false,
      markupPercent: 0,
    });

    expect(appliedCoupon).toBeUndefined();
    expect(breakdown.baseSessionCost).toBe(4200);
    expect(breakdown.timingAdjustment).toBe(0);
    expect(breakdown.subtotal).toBe(4200);
    expect(breakdown.discount).toBe(0);
    expect(breakdown.serviceCharge).toBe(126);
    expect(breakdown.total).toBe(4326);
  });

  it('F2P: caps oversized markup to max rule', () => {
    const { breakdown } = calculateReefSessionQuoteBreakdown({
      destination: 'Ratnagiri',
      sessionPackage: 'Reef Explorer',
      timingWindow: 'AFTERNOON',
      participants: 4,
      sessions: 2,
      includeEquipment: true,
      includePhotoPackage: false,
      includeInstructorPlus: false,
      markupPercent: 90,
    });

    expect(breakdown.baseSessionCost).toBe(17600);
    expect(breakdown.timingAdjustment).toBe(1408);
    expect(breakdown.equipmentCost).toBe(1440);
    expect(breakdown.markupAmount).toBe(4907.52);
    expect(breakdown.total).toBe(26116.19);
  });
});
