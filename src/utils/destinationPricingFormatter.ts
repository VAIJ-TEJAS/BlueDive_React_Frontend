import { DestinationPricingBreakdown } from '../types/destinationPricing.types';

const inr = (value: number): string => `INR ${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const line = (label: string, value: number): string => `${label}: ${inr(value)}`;

export const formatDestinationPricingBreakdown = (
  breakdown: DestinationPricingBreakdown
): string[] => [
  line('Base Stay Cost', breakdown.baseStayCost),
  line('Season Adjustment', breakdown.seasonAdjustment),
  line('Transport Cost', breakdown.transportCost),
  line('Activities Cost', breakdown.activitiesCost),
  line('Markup Amount', breakdown.markupAmount),
  line('Subtotal', breakdown.subtotal),
  line('Discount', -breakdown.discount),
  line('Service Charge', breakdown.serviceCharge),
  line('Total', breakdown.total),
];

export const summarizeDestinationPricing = (
  breakdown: DestinationPricingBreakdown
): string => formatDestinationPricingBreakdown(breakdown).join(' | ');
