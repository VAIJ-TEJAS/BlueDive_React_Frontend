import { ItineraryQuoteBreakdown } from '../types/itineraryQuote.types';

const formatInr = (amount: number): string => `INR ${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const line = (label: string, amount: number): string => `${label}: ${formatInr(amount)}`;

export const formatItineraryQuoteBreakdown = (breakdown: ItineraryQuoteBreakdown): string[] => {
  return [
    line('Base Package', breakdown.basePackage),
    line('Itinerary Adjustment', breakdown.itineraryAdjustment),
    line('Hotel Surcharge', breakdown.hotelSurcharge),
    line('Breakfast Cost', breakdown.breakfastCost),
    line('Transfer Cost', breakdown.transferCost),
    line('Seasonal Adjustment', breakdown.seasonalAdjustment),
    line('Subtotal', breakdown.subtotal),
    line('Discount', -breakdown.discount),
    line('Service Fee', breakdown.serviceFee),
    line('Total', breakdown.total),
  ];
};

export const summarizeItineraryQuote = (breakdown: ItineraryQuoteBreakdown): string => {
  return formatItineraryQuoteBreakdown(breakdown).join(' | ');
};
