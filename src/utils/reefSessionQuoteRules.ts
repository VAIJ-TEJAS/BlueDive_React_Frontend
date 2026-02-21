import { ReefSessionQuoteRules } from '../types/reefSessionQuote.types';

export const defaultReefSessionQuoteRules: ReefSessionQuoteRules = {
  basePerParticipantPerSession: {
    'Coral Intro': 1400,
    'Reef Explorer': 2200,
    'Deep Drift': 3100,
  },
  timingMultiplier: {
    MORNING: 1,
    AFTERNOON: 1.08,
    SUNSET: 1.15,
  },
  equipmentPerParticipantPerSession: 180,
  photoPackagePerParticipant: 350,
  instructorPlusPerSession: 900,
  couponDiscountPercent: {
    REEF5: 0.05,
    OCEAN7: 0.07,
    DIVE9: 0.09,
  },
  maxMarkupPercent: 24,
  serviceChargePercent: 0.03,
};

export const cloneReefSessionQuoteRules = (
  rules: ReefSessionQuoteRules
): ReefSessionQuoteRules => ({
  ...rules,
  basePerParticipantPerSession: { ...rules.basePerParticipantPerSession },
  timingMultiplier: { ...rules.timingMultiplier },
  couponDiscountPercent: { ...rules.couponDiscountPercent },
});
