import {
  FareQuoteRequest,
  FareQuoteResponse,
  FareQuoteRules,
  FareQuoteValidationResult,
} from '../types/fareQuote.types';
import { computeFareQuoteBreakdown } from './fareQuoteCalculator';
import { sanitizeFareQuoteRequest, validateFareQuoteRequest } from './fareQuoteValidators';
import { cloneFareQuoteRules, defaultFareQuoteRules, mergeFareQuoteRules } from './fareQuoteRules';

export interface FareQuoteServiceResult {
  success: boolean;
  message: string;
  data?: FareQuoteResponse;
  errors?: string[];
}

export class FareQuoteService {
  private static instance: FareQuoteService;
  private sequence: number;

  private constructor() {
    this.sequence = 0;
  }

  static getInstance(): FareQuoteService {
    if (!FareQuoteService.instance) {
      FareQuoteService.instance = new FareQuoteService();
    }

    return FareQuoteService.instance;
  }

  validate(input: Partial<FareQuoteRequest>): FareQuoteValidationResult {
    const request = sanitizeFareQuoteRequest(input);
    return validateFareQuoteRequest(request);
  }

  generateQuote(
    input: Partial<FareQuoteRequest>,
    customRules?: Partial<FareQuoteRules>
  ): FareQuoteServiceResult {
    const request = sanitizeFareQuoteRequest(input);
    const validation = validateFareQuoteRequest(request);

    if (!validation.valid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }

    const rules = mergeFareQuoteRules(customRules);
    const { breakdown, appliedCoupon } = computeFareQuoteBreakdown(request, rules);

    const quote: FareQuoteResponse = {
      quoteId: this.createQuoteId(),
      currency: 'INR',
      generatedAt: new Date().toISOString(),
      appliedCoupon,
      request,
      breakdown,
    };

    return {
      success: true,
      message: 'Fare quote generated',
      data: quote,
    };
  }

  getDefaultRules(): FareQuoteRules {
    return cloneFareQuoteRules(defaultFareQuoteRules);
  }

  private createQuoteId(): string {
    this.sequence += 1;
    const suffix = String(this.sequence).padStart(4, '0');
    const stamp = String(Date.now()).slice(-6);
    return `BDQ-${stamp}-${suffix}`;
  }
}

export default FareQuoteService;
