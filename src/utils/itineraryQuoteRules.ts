import { ItineraryQuoteRules } from '../types/itineraryQuote.types';

export const defaultItineraryQuoteRules: ItineraryQuoteRules = {
  basePerDayAdult: 2800,
  childMultiplier: 0.55,
  weekendMultiplier: 1.08,
  adventureMultiplier: 1.18,
  familyMultiplier: 1.05,
  starSurchargeByHotel: {
    3: 0,
    4: 600,
    5: 1400,
  },
  breakfastPerPersonPerDay: 220,
  transfersFlatFee: 1800,
  seasonalMultiplierByMonth: {
    JAN: 1.15,
    FEB: 1.1,
    MAR: 1.05,
    APR: 1,
    MAY: 0.96,
    JUN: 0.92,
    JUL: 0.9,
    AUG: 0.9,
    SEP: 0.95,
    OCT: 1.05,
    NOV: 1.1,
    DEC: 1.2,
  },
  serviceFeePercent: 0.035,
  promoDiscountByCode: {
    BLUEDIVE10: 0.1,
    FAMILY7: 0.07,
    GETAWAY5: 0.05,
  },
};

export const cloneItineraryQuoteRules = (rules: ItineraryQuoteRules): ItineraryQuoteRules => ({
  ...rules,
  starSurchargeByHotel: { ...rules.starSurchargeByHotel },
  seasonalMultiplierByMonth: { ...rules.seasonalMultiplierByMonth },
  promoDiscountByCode: { ...rules.promoDiscountByCode },
});
