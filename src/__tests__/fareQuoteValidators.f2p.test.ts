import { describe, it, expect } from 'vitest';
import {
  normalizeCoupon,
  sanitizeFareQuoteRequest,
  validateFareQuoteRequest,
} from '../utils/fareQuoteValidators';

describe('fareQuoteValidators - F2P', () => {
  it('F2P: sanitizes fields and normalizes coupon', () => {
    const request = sanitizeFareQuoteRequest({
      sourceCity: '  Mumbai ',
      destinationCity: ' Pune  ',
      tripType: 'One-Way Trip',
      pickupTime: ' 09:45 ',
      distanceKm: '145.5' as any,
      travellers: '3' as any,
      luggageUnits: '2' as any,
      couponCode: ' welcome10 ',
    });

    expect(request.sourceCity).toBe('Mumbai');
    expect(request.destinationCity).toBe('Pune');
    expect(request.distanceKm).toBe(145.5);
    expect(request.travellers).toBe(3);
    expect(request.luggageUnits).toBe(2);
    expect(request.couponCode).toBe('WELCOME10');
  });

  it('F2P: rejects invalid one-way payload', () => {
    const request = sanitizeFareQuoteRequest({
      sourceCity: 'Mumbai',
      destinationCity: 'Mumbai',
      tripType: 'One-Way Trip',
      pickupTime: '29:99',
      distanceKm: -30,
      travellers: 0,
      luggageUnits: 25,
    } as any);

    const result = validateFareQuoteRequest(request);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('sourceCity and destinationCity must differ for one-way trip');
    expect(result.errors).toContain('pickupTime must be HH:MM in 24-hour format');
    expect(result.errors).toContain('distanceKm must be greater than 0 for trip type');
    expect(result.errors).toContain('travellers must be an integer between 1 and 12');
    expect(result.errors).toContain('luggageUnits must be an integer between 0 and 20');
  });

  it('F2P: requires rentalHours for hourly rental', () => {
    const request = sanitizeFareQuoteRequest({
      sourceCity: 'Mumbai',
      destinationCity: 'Mumbai',
      tripType: 'Hourly Rental',
      pickupTime: '12:30',
      travellers: 2,
      luggageUnits: 1,
    });

    const result = validateFareQuoteRequest(request);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('rentalHours must be greater than 0 for hourly rental');
  });

  it('F2P: supports valid round trip payload', () => {
    const request = sanitizeFareQuoteRequest({
      sourceCity: 'Mumbai',
      destinationCity: 'Goa',
      tripType: 'Round Trip',
      pickupTime: '06:10',
      distanceKm: 590,
      travellers: 5,
      luggageUnits: 4,
    });

    const result = validateFareQuoteRequest(request);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('F2P: returns undefined for non-string coupon', () => {
    expect(normalizeCoupon(0 as any)).toBeUndefined();
    expect(normalizeCoupon(null as any)).toBeUndefined();
  });
});
