import { describe, it, expect } from 'vitest';
import { calculateItineraryQuoteBreakdown } from '../utils/itineraryQuoteCalculator';

describe('itineraryQuoteCalculator - F2P', () => {
  it('F2P: computes weekend quote with breakfast and transfer', () => {
    const result = calculateItineraryQuoteBreakdown({
      destination: 'Goa',
      itineraryType: 'Weekend Getaway',
      travelMonth: 'APR',
      days: 3,
      adults: 2,
      children: 1,
      hotelStars: 3,
      includeBreakfast: true,
      includeTransfers: true,
      promoCode: undefined,
    });

    expect(result.breakdown.basePackage).toBe(21420);
    expect(result.breakdown.itineraryAdjustment).toBe(1713.6);
    expect(result.breakdown.breakfastCost).toBe(1980);
    expect(result.breakdown.transferCost).toBe(1800);
    expect(result.breakdown.total).toBe(27855.58);
  });

  it('F2P: applies seasonal adjustment and promo discount', () => {
    const result = calculateItineraryQuoteBreakdown({
      destination: 'Goa',
      itineraryType: 'Family Vacation',
      travelMonth: 'DEC',
      days: 4,
      adults: 2,
      children: 2,
      hotelStars: 4,
      includeBreakfast: true,
      includeTransfers: true,
      promoCode: 'BLUEDIVE10',
    });

    expect(result.breakdown.seasonalAdjustment).toBeGreaterThan(0);
    expect(result.appliedPromo).toBe('BLUEDIVE10');
    expect(result.breakdown.discount).toBeGreaterThan(0);
    expect(result.breakdown.total).toBe(49379.93);
  });

  it('F2P: computes adventure quote without extras', () => {
    const result = calculateItineraryQuoteBreakdown({
      destination: 'Ladakh',
      itineraryType: 'Adventure Trip',
      travelMonth: 'JUN',
      days: 5,
      adults: 3,
      children: 0,
      hotelStars: 5,
      includeBreakfast: false,
      includeTransfers: false,
      promoCode: undefined,
    });

    expect(result.breakdown.hotelSurcharge).toBe(7000);
    expect(result.breakdown.breakfastCost).toBe(0);
    expect(result.breakdown.transferCost).toBe(0);
    expect(result.breakdown.total).toBe(53856.43);
  });

  it('F2P: ignores unknown promo codes', () => {
    const result = calculateItineraryQuoteBreakdown({
      destination: 'Goa',
      itineraryType: 'Weekend Getaway',
      travelMonth: 'APR',
      days: 2,
      adults: 2,
      children: 0,
      hotelStars: 3,
      includeBreakfast: false,
      includeTransfers: false,
      promoCode: 'UNKNOWN',
    });

    expect(result.appliedPromo).toBeUndefined();
    expect(result.breakdown.discount).toBe(0);
  });
});
