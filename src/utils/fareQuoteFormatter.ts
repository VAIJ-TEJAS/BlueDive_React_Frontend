import { FareQuoteBreakdown } from '../types/fareQuote.types';

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const asLine = (label: string, amount: number): string => {
  return `${label}: ${inr.format(amount)}`;
};

export const formatFareQuoteBreakdown = (breakdown: FareQuoteBreakdown): string[] => {
  return [
    asLine('Travel Fare', breakdown.travelFare),
    asLine('Minimum Fare Adjustment', breakdown.minimumAdjustment),
    asLine('Luggage Surcharge', breakdown.luggageSurcharge),
    asLine('Night Surcharge', breakdown.nightSurcharge),
    asLine('Surge Surcharge', breakdown.surgeSurcharge),
    asLine('Subtotal', breakdown.subtotal),
    asLine('Discount', -breakdown.discount),
    asLine('Service Fee', breakdown.serviceFee),
    asLine('Total', breakdown.total),
  ];
};

export const summarizeFareQuote = (breakdown: FareQuoteBreakdown): string => {
  const lines = formatFareQuoteBreakdown(breakdown);
  return lines.join(' | ');
};
