import { describe, it, expect } from 'vitest';
import {
  normalizeCouponCode,
  sanitizeDestinationPricingRequest,
  validateDestinationPricingRequest,
} from '../utils/destinationPricingValidators';

describe('destinationPricingValidators - F2P', () => {
  it('F2P: sanitizes payload and normalizes coupon', () => {
    const request = sanitizeDestinationPricingRequest({
      destination: '  Goa  ',
      seasonBand: 'peak' as any,
      stayMode: 'Comfort',
      nights: '4' as any,
      adults: '2' as any,
      children: '1' as any,
      includeLocalTransport: 'yes' as any,
      includeActivities: '1' as any,
      markupPercent: '12' as any,
      couponCode: ' bluedive8 ',
    });

    expect(request.destination).toBe('Goa');
    expect(request.seasonBand).toBe('PEAK');
    expect(request.nights).toBe(4);
    expect(request.adults).toBe(2);
    expect(request.children).toBe(1);
    expect(request.includeLocalTransport).toBe(true);
    expect(request.includeActivities).toBe(true);
    expect(request.markupPercent).toBe(12);
    expect(request.couponCode).toBe('BLUEDIVE8');
  });

  it('F2P: rejects invalid payload fields', () => {
    const request = sanitizeDestinationPricingRequest({
      destination: '',
      seasonBand: 'MID' as any,
      stayMode: 'Ultra' as any,
      nights: 0,
      adults: 0,
      children: 10,
      includeLocalTransport: false,
      includeActivities: false,
      markupPercent: 99,
    });

    const result = validateDestinationPricingRequest(request);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('destination is required');
    expect(result.errors).toContain('seasonBand must be PEAK, SHOULDER, or OFF');
    expect(result.errors).toContain('stayMode must be Economy, Comfort, or Luxury');
    expect(result.errors).toContain('nights must be an integer between 1 and 20');
    expect(result.errors).toContain('adults must be an integer between 1 and 8');
    expect(result.errors).toContain('children must be an integer between 0 and 6');
    expect(result.errors).toContain('markupPercent must be between 0 and 35');
  });

  it('F2P: rejects traveler count over cap', () => {
    const request = sanitizeDestinationPricingRequest({
      destination: 'Goa',
      seasonBand: 'PEAK',
      stayMode: 'Economy',
      nights: 3,
      adults: 8,
      children: 3,
      includeLocalTransport: false,
      includeActivities: false,
      markupPercent: 0,
    });

    const result = validateDestinationPricingRequest(request);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('total travelers cannot exceed 10');
  });

  it('F2P: accepts valid payload', () => {
    const request = sanitizeDestinationPricingRequest({
      destination: 'Goa',
      seasonBand: 'SHOULDER',
      stayMode: 'Luxury',
      nights: 5,
      adults: 3,
      children: 1,
      includeLocalTransport: true,
      includeActivities: true,
      markupPercent: 10,
    });

    const result = validateDestinationPricingRequest(request);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('F2P: returns undefined for non-string coupon values', () => {
    expect(normalizeCouponCode(10 as any)).toBeUndefined();
    expect(normalizeCouponCode(null as any)).toBeUndefined();
  });
});
