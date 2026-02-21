import {
  ReefSessionQuoteRequest,
  ReefSessionQuoteResponse,
  ReefSessionQuoteRules,
  ReefSessionValidationResult,
} from '../types/reefSessionQuote.types';
import { calculateReefSessionQuoteBreakdown } from './reefSessionQuoteCalculator';
import { cloneReefSessionQuoteRules, defaultReefSessionQuoteRules } from './reefSessionQuoteRules';
import { sanitizeReefSessionQuoteRequest, validateReefSessionQuoteRequest } from './reefSessionQuoteValidators';

export interface ReefSessionQuoteServiceResult {
  success: boolean;
  message: string;
  data?: ReefSessionQuoteResponse;
  errors?: string[];
}

export class ReefSessionQuoteService {
  private static instance: ReefSessionQuoteService;
  private sequence = 0;

  static getInstance(): ReefSessionQuoteService {
    if (!ReefSessionQuoteService.instance) {
      ReefSessionQuoteService.instance = new ReefSessionQuoteService();
    }
    return ReefSessionQuoteService.instance;
  }

  validate(input: Partial<ReefSessionQuoteRequest>): ReefSessionValidationResult {
    const request = sanitizeReefSessionQuoteRequest(input);
    return validateReefSessionQuoteRequest(request);
  }

  generateQuote(
    input: Partial<ReefSessionQuoteRequest>,
    customRules?: Partial<ReefSessionQuoteRules>
  ): ReefSessionQuoteServiceResult {
    const request = sanitizeReefSessionQuoteRequest(input);
    const validation = validateReefSessionQuoteRequest(request);

    if (!validation.valid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }

    const { breakdown, appliedCoupon } = calculateReefSessionQuoteBreakdown(request, customRules);

    return {
      success: true,
      message: 'Reef session quote generated',
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

  getDefaultRules(): ReefSessionQuoteRules {
    return cloneReefSessionQuoteRules(defaultReefSessionQuoteRules);
  }

  private createQuoteId(): string {
    this.sequence += 1;
    const seq = String(this.sequence).padStart(4, '0');
    const stamp = String(Date.now()).slice(-6);
    return `RSQ-${stamp}-${seq}`;
  }
}

export default ReefSessionQuoteService;
