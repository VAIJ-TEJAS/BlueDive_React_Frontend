import { describe, expect, it } from 'vitest';
import {
  sanitizeReefSessionQuoteRequest,
  validateReefSessionQuoteRequest,
} from '../utils/reefSessionQuoteValidators';

describe('reefSessionQuoteValidators - F2P', () => {
  it('F2P: sanitizes unstable inputs to safe defaults', () => {
    const sanitized = sanitizeReefSessionQuoteRequest({
      destination: ' ',
      sessionPackage: 'Invalid' as never,
      timingWindow: 'NIGHT' as never,
      participants: 0,
      sessions: 99,
      includeEquipment: 'yes' as never,
      includePhotoPackage: 1 as never,
      includeInstructorPlus: null as never,
      markupPercent: 30,
      couponCode: ' reef5 ',
    });

    expect(sanitized.destination).toBe('Unknown');
    expect(sanitized.sessionPackage).toBe('Coral Intro');
    expect(sanitized.timingWindow).toBe('MORNING');
    expect(sanitized.participants).toBe(1);
    expect(sanitized.sessions).toBe(8);
    expect(sanitized.includeEquipment).toBe(false);
    expect(sanitized.includePhotoPackage).toBe(false);
    expect(sanitized.includeInstructorPlus).toBe(false);
    expect(sanitized.couponCode).toBe('REEF5');
  });

  it('F2P: validates correct payload successfully', () => {
    const result = validateReefSessionQuoteRequest(
      sanitizeReefSessionQuoteRequest({
        destination: 'Goa',
        sessionPackage: 'Reef Explorer',
        timingWindow: 'SUNSET',
        participants: 6,
        sessions: 2,
        includeEquipment: true,
        includePhotoPackage: true,
        includeInstructorPlus: true,
        markupPercent: 12,
      })
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('F2P: reports errors for invalid ranges', () => {
    const result = validateReefSessionQuoteRequest({
      destination: 'A',
      sessionPackage: 'Deep Drift',
      timingWindow: 'AFTERNOON',
      participants: 0,
      sessions: 0,
      includeEquipment: false,
      includePhotoPackage: false,
      includeInstructorPlus: false,
      markupPercent: 25,
      couponCode: undefined,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Destination must have at least 2 characters.');
    expect(result.errors).toContain('Participants must be an integer between 1 and 40.');
    expect(result.errors).toContain('Sessions must be an integer between 1 and 8.');
    expect(result.errors).toContain('Markup percent must be between 0 and 24.');
  });
});
