import {
  ItineraryQuoteBreakdown,
  ItineraryQuoteRequest,
  ItineraryQuoteRules,
} from '../types/itineraryQuote.types';
import { cloneItineraryQuoteRules, defaultItineraryQuoteRules } from './itineraryQuoteRules';

const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

const mergeRules = (custom?: Partial<ItineraryQuoteRules>): ItineraryQuoteRules => {
  if (!custom) return cloneItineraryQuoteRules(defaultItineraryQuoteRules);

  return {
    ...defaultItineraryQuoteRules,
    ...custom,
    starSurchargeByHotel: {
      ...defaultItineraryQuoteRules.starSurchargeByHotel,
      ...(custom.starSurchargeByHotel || {}),
    },
    seasonalMultiplierByMonth: {
      ...defaultItineraryQuoteRules.seasonalMultiplierByMonth,
      ...(custom.seasonalMultiplierByMonth || {}),
    },
    promoDiscountByCode: {
      ...defaultItineraryQuoteRules.promoDiscountByCode,
      ...(custom.promoDiscountByCode || {}),
    },
  };
};

const itineraryMultiplier = (request: ItineraryQuoteRequest, rules: ItineraryQuoteRules): number => {
  if (request.itineraryType === 'Adventure Trip') return rules.adventureMultiplier;
  if (request.itineraryType === 'Family Vacation') return rules.familyMultiplier;
  return rules.weekendMultiplier;
};

const promoDiscount = (
  subtotal: number,
  code: string | undefined,
  rules: ItineraryQuoteRules
): { appliedPromo?: string; amount: number } => {
  if (!code) return { amount: 0 };
  const percent = rules.promoDiscountByCode[code] || 0;
  if (percent <= 0) return { amount: 0 };
  return {
    appliedPromo: code,
    amount: subtotal * percent,
  };
};

export const calculateItineraryQuoteBreakdown = (
  request: ItineraryQuoteRequest,
  customRules?: Partial<ItineraryQuoteRules>
): { breakdown: ItineraryQuoteBreakdown; appliedPromo?: string } => {
  const rules = mergeRules(customRules);

  const adultComponent = request.adults * request.days * rules.basePerDayAdult;
  const childComponent = request.children * request.days * rules.basePerDayAdult * rules.childMultiplier;
  const basePackage = round2(adultComponent + childComponent);

  const itineraryAdjFactor = itineraryMultiplier(request, rules) - 1;
  const itineraryAdjustment = round2(basePackage * itineraryAdjFactor);

  const hotelSurcharge = round2((rules.starSurchargeByHotel[request.hotelStars] || 0) * request.days);

  const totalPeople = request.adults + request.children;
  const breakfastCost = request.includeBreakfast
    ? round2(totalPeople * request.days * rules.breakfastPerPersonPerDay)
    : 0;

  const transferCost = request.includeTransfers ? round2(rules.transfersFlatFee) : 0;

  const preSeason = round2(basePackage + itineraryAdjustment + hotelSurcharge + breakfastCost + transferCost);
  const seasonalMultiplier = rules.seasonalMultiplierByMonth[request.travelMonth] || 1;
  const seasonalAdjustment = round2(preSeason * (seasonalMultiplier - 1));

  const subtotal = round2(preSeason + seasonalAdjustment);

  const discountInfo = promoDiscount(subtotal, request.promoCode, rules);
  const discount = round2(Math.min(subtotal, discountInfo.amount));

  const feeBase = round2(Math.max(0, subtotal - discount));
  const serviceFee = round2(feeBase * rules.serviceFeePercent);
  const total = round2(feeBase + serviceFee);

  return {
    appliedPromo: discountInfo.appliedPromo,
    breakdown: {
      basePackage,
      itineraryAdjustment,
      hotelSurcharge,
      breakfastCost,
      transferCost,
      seasonalAdjustment,
      subtotal,
      discount,
      serviceFee,
      total,
    },
  };
};
