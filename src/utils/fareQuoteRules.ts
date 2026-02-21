import { FareQuoteRules } from '../types/fareQuote.types';

export const defaultFareQuoteRules: FareQuoteRules = {
  perKmRate: 19,
  roundTripMultiplier: 1.8,
  hourlyRate: 350,
  minimumFare: 500,
  luggageSurchargePerUnit: 45,
  serviceFeePercent: 0.04,
  nightSurchargePercent: 0.2,
  nightStartHour: 22,
  nightEndHour: 5,
  surgeMultiplier: 1,
  couponDiscounts: {
    WELCOME10: 0.1,
    SAVE15: 0.15,
    FAMILY5: 0.05,
  },
};

export const cloneFareQuoteRules = (rules: FareQuoteRules): FareQuoteRules => {
  return {
    ...rules,
    couponDiscounts: {
      ...rules.couponDiscounts,
    },
  };
};

export const mergeFareQuoteRules = (overrides?: Partial<FareQuoteRules>): FareQuoteRules => {
  if (!overrides) {
    return cloneFareQuoteRules(defaultFareQuoteRules);
  }

  return {
    ...defaultFareQuoteRules,
    ...overrides,
    couponDiscounts: {
      ...defaultFareQuoteRules.couponDiscounts,
      ...(overrides.couponDiscounts || {}),
    },
  };
};
