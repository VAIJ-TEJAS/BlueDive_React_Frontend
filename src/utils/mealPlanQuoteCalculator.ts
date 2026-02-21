import {
  MealPlanQuoteRequest,
  MealPlanQuoteRules,
  MealPlanQuoteBreakdown,
} from '../types/mealPlanQuote.types';
import { cloneMealPlanQuoteRules, defaultMealPlanQuoteRules } from './mealPlanQuoteRules';

const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

const mergeRules = (custom?: Partial<MealPlanQuoteRules>): MealPlanQuoteRules => {
  if (!custom) return cloneMealPlanQuoteRules(defaultMealPlanQuoteRules);

  return {
    ...defaultMealPlanQuoteRules,
    ...custom,
    basePerAdultPerDay: {
      ...defaultMealPlanQuoteRules.basePerAdultPerDay,
      ...(custom.basePerAdultPerDay || {}),
    },
    seasonMultiplier: {
      ...defaultMealPlanQuoteRules.seasonMultiplier,
      ...(custom.seasonMultiplier || {}),
    },
    couponDiscountPercent: {
      ...defaultMealPlanQuoteRules.couponDiscountPercent,
      ...(custom.couponDiscountPercent || {}),
    },
  };
};

const couponDiscount = (
  subtotal: number,
  code: string | undefined,
  rules: MealPlanQuoteRules
): { appliedCoupon?: string; amount: number } => {
  if (!code) return { amount: 0 };
  const percent = rules.couponDiscountPercent[code] || 0;
  if (percent <= 0) return { amount: 0 };
  return { appliedCoupon: code, amount: subtotal * percent };
};

export const calculateMealPlanQuoteBreakdown = (
  request: MealPlanQuoteRequest,
  customRules?: Partial<MealPlanQuoteRules>
): { breakdown: MealPlanQuoteBreakdown; appliedCoupon?: string } => {
  const rules = mergeRules(customRules);

  const adultDaily = rules.basePerAdultPerDay[request.mealPlanType] || 0;
  const adultsCost = request.adults * request.days * adultDaily;
  const childrenCost = request.children * request.days * adultDaily * rules.childMultiplier;
  const baseMealCost = round2(adultsCost + childrenCost);

  const seasonFactor = rules.seasonMultiplier[request.season] || 1;
  const seasonAdjustment = round2(baseMealCost * (seasonFactor - 1));

  const guests = request.adults + request.children;
  const snacksCost = request.includeWelcomeSnacks ? round2(guests * rules.welcomeSnacksPerPerson) : 0;
  const dessertsCost = request.includeDesserts ? round2(guests * request.days * rules.dessertsPerPersonPerDay) : 0;
  const liveCounterCost = request.includeLiveCounter ? round2(request.days * rules.liveCounterPerDay) : 0;

  const preMarkup = round2(baseMealCost + seasonAdjustment + snacksCost + dessertsCost + liveCounterCost);
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
      baseMealCost,
      seasonAdjustment,
      snacksCost,
      dessertsCost,
      liveCounterCost,
      markupAmount,
      subtotal,
      discount,
      serviceCharge,
      total,
    },
  };
};
