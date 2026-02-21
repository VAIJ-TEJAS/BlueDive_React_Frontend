import { describe, it, expect } from 'vitest';
import {
  normalizePromoCode,
  sanitizeItineraryQuoteRequest,
  validateItineraryQuoteRequest,
} from '../utils/itineraryQuoteValidators';

describe('itineraryQuoteValidators - F2P', () => {
  it('F2P: sanitizes and normalizes promo code', () => {
    const request = sanitizeItineraryQuoteRequest({
      destination: '  Goa  ',
      itineraryType: 'Family Vacation',
      travelMonth: ' dec ',
      days: '4' as any,
      adults: '2' as any,
      children: '1' as any,
      hotelStars: '4' as any,
      includeBreakfast: 'yes' as any,
      includeTransfers: '1' as any,
      promoCode: ' bluedive10 ',
    });

    expect(request.destination).toBe('Goa');
    expect(request.travelMonth).toBe('DEC');
    expect(request.days).toBe(4);
    expect(request.adults).toBe(2);
    expect(request.children).toBe(1);
    expect(request.promoCode).toBe('BLUEDIVE10');
    expect(request.includeBreakfast).toBe(true);
    expect(request.includeTransfers).toBe(true);
  });

  it('F2P: rejects invalid payload', () => {
    const request = sanitizeItineraryQuoteRequest({
      destination: '',
      itineraryType: 'Random' as any,
      travelMonth: 'XYZ',
      days: 0,
      adults: 0,
      children: 9,
      hotelStars: 2,
      includeBreakfast: false,
      includeTransfers: false,
    });

    const result = validateItineraryQuoteRequest(request);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('destination is required');
    expect(result.errors).toContain('itineraryType must be Weekend Getaway, Adventure Trip, or Family Vacation');
    expect(result.errors).toContain('travelMonth must be a valid 3-letter month code');
    expect(result.errors).toContain('days must be an integer between 1 and 15');
    expect(result.errors).toContain('adults must be an integer between 1 and 8');
    expect(result.errors).toContain('children must be an integer between 0 and 6');
    expect(result.errors).toContain('hotelStars must be one of: 3, 4, 5');
  });

  it('F2P: rejects traveler count over cap', () => {
    const request = sanitizeItineraryQuoteRequest({
      destination: 'Goa',
      itineraryType: 'Weekend Getaway',
      travelMonth: 'JAN',
      days: 3,
      adults: 8,
      children: 3,
      hotelStars: 3,
      includeBreakfast: false,
      includeTransfers: false,
    });

    const result = validateItineraryQuoteRequest(request);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('total travelers cannot exceed 10');
  });

  it('F2P: accepts valid adventure trip payload', () => {
    const request = sanitizeItineraryQuoteRequest({
      destination: 'Ladakh',
      itineraryType: 'Adventure Trip',
      travelMonth: 'JUN',
      days: 6,
      adults: 3,
      children: 0,
      hotelStars: 3,
      includeBreakfast: true,
      includeTransfers: true,
    });

    const result = validateItineraryQuoteRequest(request);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('F2P: returns undefined for non-string promo', () => {
    expect(normalizePromoCode(5 as any)).toBeUndefined();
    expect(normalizePromoCode(null as any)).toBeUndefined();
  });
});
