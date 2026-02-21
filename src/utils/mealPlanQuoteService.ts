import {
  MealPlanQuoteRequest,
  MealPlanQuoteResponse,
  MealPlanQuoteRules,
  MealPlanValidationResult,
} from '../types/mealPlanQuote.types';
import { calculateMealPlanQuoteBreakdown } from './mealPlanQuoteCalculator';
import { cloneMealPlanQuoteRules, defaultMealPlanQuoteRules } from './mealPlanQuoteRules';
import { sanitizeMealPlanQuoteRequest, validateMealPlanQuoteRequest } from './mealPlanQuoteValidators';

export interface MealPlanQuoteServiceResult {
  success: boolean;
  message: string;
  data?: MealPlanQuoteResponse;
  errors?: string[];
}

export class MealPlanQuoteService {
  private static instance: MealPlanQuoteService;
  private sequence = 0;

  static getInstance(): MealPlanQuoteService {
    if (!MealPlanQuoteService.instance) {
      MealPlanQuoteService.instance = new MealPlanQuoteService();
    }
    return MealPlanQuoteService.instance;
  }

  validate(input: Partial<MealPlanQuoteRequest>): MealPlanValidationResult {
    const request = sanitizeMealPlanQuoteRequest(input);
    return validateMealPlanQuoteRequest(request);
  }

  generateQuote(
    input: Partial<MealPlanQuoteRequest>,
    customRules?: Partial<MealPlanQuoteRules>
  ): MealPlanQuoteServiceResult {
    const request = sanitizeMealPlanQuoteRequest(input);
    const validation = validateMealPlanQuoteRequest(request);

    if (!validation.valid) {
      return { success: false, message: 'Validation failed', errors: validation.errors };
    }

    const { breakdown, appliedCoupon } = calculateMealPlanQuoteBreakdown(request, customRules);

    return {
      success: true,
      message: 'Meal plan quote generated',
      data: {
        quoteId: this.createQuoteId(),
        generatedAt: new Date().toISOString(),
        currency: 'INR',
        request,
        breakdown,
        appliedCoupon,
      },
    };
  }

  getDefaultRules(): MealPlanQuoteRules {
    return cloneMealPlanQuoteRules(defaultMealPlanQuoteRules);
  }

  private createQuoteId(): string {
    this.sequence += 1;
    const seq = String(this.sequence).padStart(4, '0');
    const stamp = String(Date.now()).slice(-6);
    return `MPQ-${stamp}-${seq}`;
  }
}

export default MealPlanQuoteService;
