import { GearRentalQuoteBreakdown } from '../types/gearRentalQuote.types';

export const formatGearRentalCurrency = (value: number): string => `INR ${value.toFixed(2)}`;

export const summarizeGearRentalQuote = (breakdown: GearRentalQuoteBreakdown): string => {
  const segments = [
    `Base: ${formatGearRentalCurrency(breakdown.baseRentalCost)}`,
    `Demand Adj: ${formatGearRentalCurrency(breakdown.demandAdjustment)}`,
    `Delivery: ${formatGearRentalCurrency(breakdown.deliveryCost)}`,
    `Pickup: ${formatGearRentalCurrency(breakdown.pickupCost)}`,
    `Safety: ${formatGearRentalCurrency(breakdown.safetyBriefingCost)}`,
    `Markup: ${formatGearRentalCurrency(breakdown.markupAmount)}`,
    `Discount: ${formatGearRentalCurrency(breakdown.discount)}`,
    `Platform Fee: ${formatGearRentalCurrency(breakdown.platformFee)}`,
    `Total: ${formatGearRentalCurrency(breakdown.total)}`,
  ];

  return segments.join(' | ');
};
