import { MealPlanQuoteBreakdown } from '../types/mealPlanQuote.types';

const inr = (value: number): string => `INR ${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const line = (label: string, value: number): string => `${label}: ${inr(value)}`;

export const formatMealPlanQuoteBreakdown = (breakdown: MealPlanQuoteBreakdown): string[] => [
  line('Base Meal Cost', breakdown.baseMealCost),
  line('Season Adjustment', breakdown.seasonAdjustment),
  line('Snacks Cost', breakdown.snacksCost),
  line('Desserts Cost', breakdown.dessertsCost),
  line('Live Counter Cost', breakdown.liveCounterCost),
  line('Markup Amount', breakdown.markupAmount),
  line('Subtotal', breakdown.subtotal),
  line('Discount', -breakdown.discount),
  line('Service Charge', breakdown.serviceCharge),
  line('Total', breakdown.total),
];

export const summarizeMealPlanQuote = (breakdown: MealPlanQuoteBreakdown): string =>
  formatMealPlanQuoteBreakdown(breakdown).join(' | ');
