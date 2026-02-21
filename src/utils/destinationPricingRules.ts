import { DestinationPricingRules } from '../types/destinationPricing.types';

export const defaultDestinationPricingRules: DestinationPricingRules = {
  baseNightlyByStayMode: {
    Economy: 2200,
    Comfort: 3600,
    Luxury: 6200,
  },
  childNightlyMultiplier: 0.5,
  seasonMultiplier: {
    PEAK: 1.25,
    SHOULDER: 1.05,
    OFF: 0.88,
  },
  localTransportFlatPerNight: 900,
  activitiesFlatPerPerson: 1400,
  serviceChargePercent: 0.03,
  maxMarkupPercent: 35,
  couponDiscountPercent: {
    BLUEDIVE8: 0.08,
    OFFPEAK5: 0.05,
    FAMILY10: 0.1,
  },
};

export const cloneDestinationPricingRules = (
  rules: DestinationPricingRules
): DestinationPricingRules => ({
  ...rules,
  baseNightlyByStayMode: { ...rules.baseNightlyByStayMode },
  seasonMultiplier: { ...rules.seasonMultiplier },
  couponDiscountPercent: { ...rules.couponDiscountPercent },
});
