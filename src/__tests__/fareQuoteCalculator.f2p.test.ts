import { describe, it, expect } from 'vitest';
import { computeFareQuoteBreakdown, isNightPickup } from '../utils/fareQuoteCalculator';
import { defaultFareQuoteRules } from '../utils/fareQuoteRules';

describe('fareQuoteCalculator - F2P', () => {
  it('F2P: applies minimum fare for short one-way trip', () => {
    const result = computeFareQuoteBreakdown({
      sourceCity: 'Mumbai',
      destinationCity: 'Thane',
      tripType: 'One-Way Trip',
      pickupTime: '14:00',
      distanceKm: 8,
      travellers: 2,
      luggageUnits: 1,
    });

    expect(result.breakdown.travelFare).toBe(500);
    expect(result.breakdown.minimumAdjustment).toBe(348);
    expect(result.breakdown.luggageSurcharge).toBe(45);
    expect(result.breakdown.total).toBe(566.8);
  });

  it('F2P: applies night surcharge and coupon discount correctly', () => {
    const result = computeFareQuoteBreakdown({
      sourceCity: 'Mumbai',
      destinationCity: 'Pune',
      tripType: 'One-Way Trip',
      pickupTime: '23:00',
      distanceKm: 180,
      travellers: 3,
      luggageUnits: 2,
      couponCode: 'WELCOME10',
    });

    expect(result.breakdown.travelFare).toBe(3420);
    expect(result.breakdown.nightSurcharge).toBe(702);
    expect(result.appliedCoupon).toBe('WELCOME10');
    expect(result.breakdown.discount).toBe(421.2);
    expect(result.breakdown.total).toBe(3942.43);
  });

  it('F2P: computes hourly rental fare path', () => {
    const result = computeFareQuoteBreakdown({
      sourceCity: 'Mumbai',
      destinationCity: 'Mumbai',
      tripType: 'Hourly Rental',
      pickupTime: '11:30',
      rentalHours: 4,
      travellers: 2,
      luggageUnits: 0,
    });

    expect(result.breakdown.travelFare).toBe(1400);
    expect(result.breakdown.minimumAdjustment).toBe(0);
    expect(result.breakdown.subtotal).toBe(1400);
    expect(result.breakdown.total).toBe(1456);
  });

  it('F2P: detects night window over midnight', () => {
    expect(isNightPickup('23:30', defaultFareQuoteRules)).toBe(true);
    expect(isNightPickup('04:15', defaultFareQuoteRules)).toBe(true);
    expect(isNightPickup('15:15', defaultFareQuoteRules)).toBe(false);
  });
});
