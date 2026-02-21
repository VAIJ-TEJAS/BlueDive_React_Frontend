import {
  GearRentalQuoteRequest,
  GearRentalQuoteRules,
  GearRentalQuoteBreakdown,
} from '../types/gearRentalQuote.types';
import { cloneGearRentalQuoteRules, defaultGearRentalQuoteRules } from './gearRentalQuoteRules';

const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

const mergeRules = (custom?: Partial<GearRentalQuoteRules>): GearRentalQuoteRules => {
  if (!custom) return cloneGearRentalQuoteRules(defaultGearRentalQuoteRules);

  return {
    ...defaultGearRentalQuoteRules,
    ...custom,
    basePerUnitPerDay: {
      ...defaultGearRentalQuoteRules.basePerUnitPerDay,
      ...(custom.basePerUnitPerDay || {}),
    },
    demandMultiplier: {
      ...defaultGearRentalQuoteRules.demandMultiplier,
      ...(custom.demandMultiplier || {}),
    },
    couponDiscountPercent: {
      ...defaultGearRentalQuoteRules.couponDiscountPercent,
      ...(custom.couponDiscountPercent || {}),
    },
  };
};

const discountFromCoupon = (
  subtotal: number,
  code: string | undefined,
  rules: GearRentalQuoteRules
): { appliedCoupon?: string; amount: number } => {
  if (!code) return { amount: 0 };
  const discountPercent = rules.couponDiscountPercent[code] || 0;
  if (discountPercent <= 0) return { amount: 0 };
  return {
    appliedCoupon: code,
    amount: subtotal * discountPercent,
  };
};

export const calculateGearRentalQuoteBreakdown = (
  request: GearRentalQuoteRequest,
  customRules?: Partial<GearRentalQuoteRules>
): { breakdown: GearRentalQuoteBreakdown; appliedCoupon?: string } => {
  const rules = mergeRules(customRules);

  const unitPerDay = rules.basePerUnitPerDay[request.category] || 0;
  const baseRentalCost = round2(unitPerDay * request.quantity * request.days);

  const demandFactor = rules.demandMultiplier[request.demandBand] || 1;
  const demandAdjustment = round2(baseRentalCost * (demandFactor - 1));

  const deliveryCost = request.includeDelivery ? round2(request.quantity * rules.deliveryPerUnit) : 0;
  const pickupCost = request.includePickup ? round2(request.quantity * rules.pickupPerUnit) : 0;
  const safetyBriefingCost = request.includeSafetyBriefing ? round2(rules.safetyBriefingPerBooking) : 0;

  const beforeMarkup = round2(
    baseRentalCost + demandAdjustment + deliveryCost + pickupCost + safetyBriefingCost
  );

  const markupPercent = Math.max(0, Math.min(request.markupPercent || 0, rules.maxMarkupPercent));
  const markupAmount = round2(beforeMarkup * (markupPercent / 100));

  const subtotal = round2(beforeMarkup + markupAmount);

  const couponInfo = discountFromCoupon(subtotal, request.couponCode, rules);
  const discount = round2(Math.min(couponInfo.amount, subtotal));

  const chargeBase = round2(Math.max(0, subtotal - discount));
  const platformFee = round2(chargeBase * rules.platformFeePercent);
  const total = round2(chargeBase + platformFee);

  return {
    appliedCoupon: couponInfo.appliedCoupon,
    breakdown: {
      baseRentalCost,
      demandAdjustment,
      deliveryCost,
      pickupCost,
      safetyBriefingCost,
      markupAmount,
      subtotal,
      discount,
      platformFee,
      total,
    },
  };
};
