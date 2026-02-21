import { describe, expect, it } from 'vitest';
import { calculateGearRentalQuoteBreakdown } from '../utils/gearRentalQuoteCalculator';

describe('gearRentalQuoteCalculator - F2P', () => {
  it('F2P: calculates expected totals with add-ons and coupon', () => {
    const { breakdown, appliedCoupon } = calculateGearRentalQuoteBreakdown({
      destination: 'Goa',
      category: 'Scuba Premium',
      demandBand: 'PEAK',
      days: 2,
      quantity: 5,
      includeDelivery: true,
      includePickup: true,
      includeSafetyBriefing: true,
      markupPercent: 10,
      couponCode: 'CREW10',
    });

    expect(appliedCoupon).toBe('CREW10');
    expect(breakdown.baseRentalCost).toBe(18000);
    expect(breakdown.demandAdjustment).toBe(3960);
    expect(breakdown.deliveryCost).toBe(375);
    expect(breakdown.pickupCost).toBe(375);
    expect(breakdown.safetyBriefingCost).toBe(450);
    expect(breakdown.markupAmount).toBe(2316);
    expect(breakdown.subtotal).toBe(25476);
    expect(breakdown.discount).toBe(2547.6);
    expect(breakdown.platformFee).toBe(687.85);
    expect(breakdown.total).toBe(23616.25);
  });

  it('F2P: handles no add-ons and no discount', () => {
    const { breakdown, appliedCoupon } = calculateGearRentalQuoteBreakdown({
      destination: 'Ratnagiri',
      category: 'Snorkeling Kit',
      demandBand: 'LOW',
      days: 1,
      quantity: 3,
      includeDelivery: false,
      includePickup: false,
      includeSafetyBriefing: false,
      markupPercent: 0,
    });

    expect(appliedCoupon).toBeUndefined();
    expect(breakdown.baseRentalCost).toBe(1050);
    expect(breakdown.demandAdjustment).toBe(-105);
    expect(breakdown.subtotal).toBe(945);
    expect(breakdown.discount).toBe(0);
    expect(breakdown.platformFee).toBe(28.35);
    expect(breakdown.total).toBe(973.35);
  });

  it('F2P: caps markup at rule max when oversized', () => {
    const { breakdown } = calculateGearRentalQuoteBreakdown({
      destination: 'Tarkarli',
      category: 'Kayak Double',
      demandBand: 'REGULAR',
      days: 4,
      quantity: 2,
      includeDelivery: true,
      includePickup: true,
      includeSafetyBriefing: false,
      markupPercent: 99,
    });

    expect(breakdown.baseRentalCost).toBe(11200);
    expect(breakdown.deliveryCost).toBe(150);
    expect(breakdown.pickupCost).toBe(150);
    expect(breakdown.markupAmount).toBe(2875);
    expect(breakdown.total).toBe(14806.25);
  });
});
