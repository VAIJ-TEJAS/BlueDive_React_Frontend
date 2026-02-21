import {
  ReefSessionQuoteRequest,
  ReefSessionValidationResult,
  SessionPackage,
  TimingWindow,
} from '../types/reefSessionQuote.types';

const allowedPackages: SessionPackage[] = ['Coral Intro', 'Reef Explorer', 'Deep Drift'];
const allowedWindows: TimingWindow[] = ['MORNING', 'AFTERNOON', 'SUNSET'];

const clampInt = (value: unknown, min: number, max: number): number => {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
};

const normalizeText = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
};

const normalizeBool = (value: unknown): boolean => value === true;

const normalizePackage = (value: unknown): SessionPackage => {
  if (typeof value !== 'string') return 'Coral Intro';
  return (allowedPackages.includes(value as SessionPackage) ? value : 'Coral Intro') as SessionPackage;
};

const normalizeWindow = (value: unknown): TimingWindow => {
  if (typeof value !== 'string') return 'MORNING';
  return (allowedWindows.includes(value as TimingWindow) ? value : 'MORNING') as TimingWindow;
};

export const sanitizeReefSessionQuoteRequest = (
  input: Partial<ReefSessionQuoteRequest>
): ReefSessionQuoteRequest => ({
  destination: normalizeText(input.destination, 'Unknown'),
  sessionPackage: normalizePackage(input.sessionPackage),
  timingWindow: normalizeWindow(input.timingWindow),
  participants: clampInt(input.participants, 1, 40),
  sessions: clampInt(input.sessions, 1, 8),
  includeEquipment: normalizeBool(input.includeEquipment),
  includePhotoPackage: normalizeBool(input.includePhotoPackage),
  includeInstructorPlus: normalizeBool(input.includeInstructorPlus),
  markupPercent: Number.isFinite(Number(input.markupPercent)) ? Number(input.markupPercent) : 0,
  couponCode: typeof input.couponCode === 'string' ? input.couponCode.trim().toUpperCase() : undefined,
});

export const validateReefSessionQuoteRequest = (
  request: ReefSessionQuoteRequest
): ReefSessionValidationResult => {
  const errors: string[] = [];

  if (!request.destination || request.destination.trim().length < 2) {
    errors.push('Destination must have at least 2 characters.');
  }
  if (!allowedPackages.includes(request.sessionPackage)) {
    errors.push('Invalid session package.');
  }
  if (!allowedWindows.includes(request.timingWindow)) {
    errors.push('Invalid timing window.');
  }
  if (!Number.isInteger(request.participants) || request.participants < 1 || request.participants > 40) {
    errors.push('Participants must be an integer between 1 and 40.');
  }
  if (!Number.isInteger(request.sessions) || request.sessions < 1 || request.sessions > 8) {
    errors.push('Sessions must be an integer between 1 and 8.');
  }

  const markup = request.markupPercent || 0;
  if (!Number.isFinite(markup) || markup < 0 || markup > 24) {
    errors.push('Markup percent must be between 0 and 24.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
