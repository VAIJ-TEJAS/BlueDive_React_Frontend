import {
  DestinationPricingBreakdown,
  DestinationPricingRequest,
  DestinationPricingRules,
} from '../types/destinationPricing.types';
import {
  cloneDestinationPricingRules,
  defaultDestinationPricingRules,
} from './destinationPricingRules';

const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

const mergeRules = (custom?: Partial<DestinationPricingRules>): DestinationPricingRules => {
  if (!custom) return cloneDestinationPricingRules(defaultDestinationPricingRules);

  return {
    ...defaultDestinationPricingRules,
    ...custom,
    baseNightlyByStayMode: {
      ...defaultDestinationPricingRules.baseNightlyByStayMode,
      ...(custom.baseNightlyByStayMode || {}),
    },
    seasonMultiplier: {
      ...defaultDestinationPricingRules.seasonMultiplier,
      ...(custom.seasonMultiplier || {}),
    },
    couponDiscountPercent: {
      ...defaultDestinationPricingRules.couponDiscountPercent,
      ...(custom.couponDiscountPercent || {}),
    },
  };
};

const couponDiscount = (
  subtotal: number,
  code: string | undefined,
  rules: DestinationPricingRules
): { appliedCoupon?: string; amount: number } => {
  if (!code) return { amount: 0 };
  const percent = rules.couponDiscountPercent[code] || 0;
  if (percent <= 0) return { amount: 0 };
  return { appliedCoupon: code, amount: subtotal * percent };
};

export const calculateDestinationPricingBreakdown = (
  request: DestinationPricingRequest,
  customRules?: Partial<DestinationPricingRules>
): { breakdown: DestinationPricingBreakdown; appliedCoupon?: string } => {
  const rules = mergeRules(customRules);

  const nightly = rules.baseNightlyByStayMode[request.stayMode] || 0;
  const adultsCost = request.adults * request.nights * nightly;
  const childrenCost = request.children * request.nights * nightly * rules.childNightlyMultiplier;
  const baseStayCost = round2(adultsCost + childrenCost);

  const seasonFactor = rules.seasonMultiplier[request.seasonBand] || 1;
  const seasonAdjustment = round2(baseStayCost * (seasonFactor - 1));

  const transportCost = request.includeLocalTransport
    ? round2(request.nights * rules.localTransportFlatPerNight)
    : 0;

  const activitiesCost = request.includeActivities
    ? round2((request.adults + request.children) * rules.activitiesFlatPerPerson)
    : 0;

  const preMarkup = round2(baseStayCost + seasonAdjustment + transportCost + activitiesCost);
  const markup = Math.max(0, Math.min(request.markupPercent || 0, rules.maxMarkupPercent));
  const markupAmount = round2(preMarkup * (markup / 100));

  const subtotal = round2(preMarkup + markupAmount);

  const discountInfo = couponDiscount(subtotal, request.couponCode, rules);
  const discount = round2(Math.min(discountInfo.amount, subtotal));

  const chargeBase = round2(Math.max(0, subtotal - discount));
  const serviceCharge = round2(chargeBase * rules.serviceChargePercent);
  const total = round2(chargeBase + serviceCharge);

  return {
    appliedCoupon: discountInfo.appliedCoupon,
    breakdown: {
      baseStayCost,
      seasonAdjustment,
      transportCost,
      activitiesCost,
      markupAmount,
      subtotal,
      discount,
      serviceCharge,
      total,
    },
  };
};
