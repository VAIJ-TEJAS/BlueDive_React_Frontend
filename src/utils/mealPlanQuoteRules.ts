import { MealPlanQuoteRules } from '../types/mealPlanQuote.types';

export const defaultMealPlanQuoteRules: MealPlanQuoteRules = {
  basePerAdultPerDay: {
    'Veg Standard': 850,
    'Veg Premium': 1320,
    'Mixed Deluxe': 1850,
  },
  childMultiplier: 0.6,
  seasonMultiplier: {
    PEAK: 1.2,
    REGULAR: 1,
    LOW: 0.9,
  },
  welcomeSnacksPerPerson: 180,
  dessertsPerPersonPerDay: 140,
  liveCounterPerDay: 2400,
  serviceChargePercent: 0.03,
  maxMarkupPercent: 25,
  couponDiscountPercent: {
    MEAL5: 0.05,
    FAMILY8: 0.08,
    DELUXE10: 0.1,
  },
};

export const cloneMealPlanQuoteRules = (rules: MealPlanQuoteRules): MealPlanQuoteRules => ({
  ...rules,
  basePerAdultPerDay: { ...rules.basePerAdultPerDay },
  seasonMultiplier: { ...rules.seasonMultiplier },
  couponDiscountPercent: { ...rules.couponDiscountPercent },
});
