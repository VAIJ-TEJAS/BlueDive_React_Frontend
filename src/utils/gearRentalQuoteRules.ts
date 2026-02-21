import { GearRentalQuoteRules } from '../types/gearRentalQuote.types';

export const defaultGearRentalQuoteRules: GearRentalQuoteRules = {
  basePerUnitPerDay: {
    'Snorkeling Kit': 350,
    'Scuba Basic': 1200,
    'Scuba Premium': 1800,
    'Kayak Single': 900,
    'Kayak Double': 1400,
    'Paddle Board': 1100,
  },
  demandMultiplier: {
    LOW: 0.9,
    REGULAR: 1,
    PEAK: 1.22,
  },
  deliveryPerUnit: 75,
  pickupPerUnit: 75,
  safetyBriefingPerBooking: 450,
  couponDiscountPercent: {
    DIVE5: 0.05,
    OCEAN8: 0.08,
    CREW10: 0.1,
  },
  maxMarkupPercent: 25,
  platformFeePercent: 0.03,
};

export const cloneGearRentalQuoteRules = (rules: GearRentalQuoteRules): GearRentalQuoteRules => ({
  ...rules,
  basePerUnitPerDay: { ...rules.basePerUnitPerDay },
  demandMultiplier: { ...rules.demandMultiplier },
  couponDiscountPercent: { ...rules.couponDiscountPercent },
});
