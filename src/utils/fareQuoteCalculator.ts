import {
  FareQuoteBreakdown,
  FareQuoteRequest,
  FareQuoteRules,
} from '../types/fareQuote.types';
import { mergeFareQuoteRules } from './fareQuoteRules';

const round2 = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

const parseHour = (pickupTime: string): number => {
  return Number(pickupTime.split(':')[0]);
};

export const isNightPickup = (pickupTime: string, rules: FareQuoteRules): boolean => {
  const hour = parseHour(pickupTime);
  if (!Number.isFinite(hour)) return false;

  if (rules.nightStartHour > rules.nightEndHour) {
    return hour >= rules.nightStartHour || hour < rules.nightEndHour;
  }

  return hour >= rules.nightStartHour && hour < rules.nightEndHour;
};

const computeTravelFare = (request: FareQuoteRequest, rules: FareQuoteRules): number => {
  if (request.tripType === 'Hourly Rental') {
    return (request.rentalHours || 0) * rules.hourlyRate;
  }

  const baseDistanceFare = (request.distanceKm || 0) * rules.perKmRate;
  if (request.tripType === 'Round Trip') {
    return baseDistanceFare * rules.roundTripMultiplier;
  }

  return baseDistanceFare;
};

const computeDiscount = (
  subtotal: number,
  couponCode: string | undefined,
  rules: FareQuoteRules
): { appliedCoupon?: string; discount: number } => {
  if (!couponCode) {
    return { discount: 0 };
  }

  const percent = rules.couponDiscounts[couponCode] || 0;
  if (percent <= 0) {
    return { discount: 0 };
  }

  return {
    appliedCoupon: couponCode,
    discount: subtotal * percent,
  };
};

export const computeFareQuoteBreakdown = (
  request: FareQuoteRequest,
  customRules?: Partial<FareQuoteRules>
): { breakdown: FareQuoteBreakdown; appliedCoupon?: string } => {
  const rules = mergeFareQuoteRules(customRules);

  const rawTravelFare = computeTravelFare(request, rules);
  const travelFare = Math.max(rawTravelFare, rules.minimumFare);
  const minimumAdjustment = round2(travelFare - rawTravelFare);

  const luggageSurcharge = round2(request.luggageUnits * rules.luggageSurchargePerUnit);

  const nightSurcharge = isNightPickup(request.pickupTime, rules)
    ? round2((travelFare + luggageSurcharge) * rules.nightSurchargePercent)
    : 0;

  const surgeSurcharge = round2(
    (travelFare + luggageSurcharge + nightSurcharge) * (rules.surgeMultiplier - 1)
  );

  const subtotal = round2(travelFare + luggageSurcharge + nightSurcharge + surgeSurcharge);

  const discountInfo = computeDiscount(subtotal, request.couponCode, rules);
  const discount = round2(Math.min(subtotal, discountInfo.discount));

  const discountedSubtotal = round2(Math.max(0, subtotal - discount));
  const serviceFee = round2(discountedSubtotal * rules.serviceFeePercent);
  const total = round2(discountedSubtotal + serviceFee);

  return {
    appliedCoupon: discountInfo.appliedCoupon,
    breakdown: {
      travelFare: round2(travelFare),
      minimumAdjustment,
      luggageSurcharge,
      nightSurcharge,
      surgeSurcharge,
      subtotal,
      discount,
      serviceFee,
      total,
    },
  };
};
