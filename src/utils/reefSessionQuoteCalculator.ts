import {
  ReefSessionQuoteBreakdown,
  ReefSessionQuoteRequest,
  ReefSessionQuoteRules,
} from '../types/reefSessionQuote.types';
import { cloneReefSessionQuoteRules, defaultReefSessionQuoteRules } from './reefSessionQuoteRules';

const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

const mergeRules = (custom?: Partial<ReefSessionQuoteRules>): ReefSessionQuoteRules => {
  if (!custom) return cloneReefSessionQuoteRules(defaultReefSessionQuoteRules);

  return {
    ...defaultReefSessionQuoteRules,
    ...custom,
    basePerParticipantPerSession: {
      ...defaultReefSessionQuoteRules.basePerParticipantPerSession,
      ...(custom.basePerParticipantPerSession || {}),
    },
    timingMultiplier: {
      ...defaultReefSessionQuoteRules.timingMultiplier,
      ...(custom.timingMultiplier || {}),
    },
    couponDiscountPercent: {
      ...defaultReefSessionQuoteRules.couponDiscountPercent,
      ...(custom.couponDiscountPercent || {}),
    },
  };
};

const couponDiscount = (
  subtotal: number,
  code: string | undefined,
  rules: ReefSessionQuoteRules
): { appliedCoupon?: string; amount: number } => {
  if (!code) return { amount: 0 };
  const percent = rules.couponDiscountPercent[code] || 0;
  if (percent <= 0) return { amount: 0 };
  return { appliedCoupon: code, amount: subtotal * percent };
};

export const calculateReefSessionQuoteBreakdown = (
  request: ReefSessionQuoteRequest,
  customRules?: Partial<ReefSessionQuoteRules>
): { breakdown: ReefSessionQuoteBreakdown; appliedCoupon?: string } => {
  const rules = mergeRules(customRules);

  const baseRate = rules.basePerParticipantPerSession[request.sessionPackage] || 0;
  const baseSessionCost = round2(baseRate * request.participants * request.sessions);

  const timingFactor = rules.timingMultiplier[request.timingWindow] || 1;
  const timingAdjustment = round2(baseSessionCost * (timingFactor - 1));

  const equipmentCost = request.includeEquipment
    ? round2(request.participants * request.sessions * rules.equipmentPerParticipantPerSession)
    : 0;
  const photoPackageCost = request.includePhotoPackage
    ? round2(request.participants * rules.photoPackagePerParticipant)
    : 0;
  const instructorPlusCost = request.includeInstructorPlus
    ? round2(request.sessions * rules.instructorPlusPerSession)
    : 0;

  const preMarkup = round2(
    baseSessionCost + timingAdjustment + equipmentCost + photoPackageCost + instructorPlusCost
  );

  const markupPercent = Math.max(0, Math.min(request.markupPercent || 0, rules.maxMarkupPercent));
  const markupAmount = round2(preMarkup * (markupPercent / 100));

  const subtotal = round2(preMarkup + markupAmount);
  const discountInfo = couponDiscount(subtotal, request.couponCode, rules);
  const discount = round2(Math.min(discountInfo.amount, subtotal));

  const chargeBase = round2(Math.max(0, subtotal - discount));
  const serviceCharge = round2(chargeBase * rules.serviceChargePercent);
  const total = round2(chargeBase + serviceCharge);

  return {
    appliedCoupon: discountInfo.appliedCoupon,
    breakdown: {
      baseSessionCost,
      timingAdjustment,
      equipmentCost,
      photoPackageCost,
      instructorPlusCost,
      markupAmount,
      subtotal,
      discount,
      serviceCharge,
      total,
    },
  };
};
