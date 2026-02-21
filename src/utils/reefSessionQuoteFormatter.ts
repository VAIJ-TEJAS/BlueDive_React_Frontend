import { ReefSessionQuoteBreakdown } from '../types/reefSessionQuote.types';

const inr = (value: number): string => `INR ${value.toFixed(2)}`;

export const summarizeReefSessionQuote = (breakdown: ReefSessionQuoteBreakdown): string => {
  const parts = [
    `Base: ${inr(breakdown.baseSessionCost)}`,
    `Timing Adj: ${inr(breakdown.timingAdjustment)}`,
    `Equipment: ${inr(breakdown.equipmentCost)}`,
    `Photo: ${inr(breakdown.photoPackageCost)}`,
    `Instructor+: ${inr(breakdown.instructorPlusCost)}`,
    `Markup: ${inr(breakdown.markupAmount)}`,
    `Discount: ${inr(breakdown.discount)}`,
    `Service: ${inr(breakdown.serviceCharge)}`,
    `Total: ${inr(breakdown.total)}`,
  ];

  return parts.join(' | ');
};
