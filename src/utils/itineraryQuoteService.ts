import {
  ItineraryQuoteRequest,
  ItineraryQuoteResponse,
  ItineraryQuoteRules,
  ItineraryValidationResult,
} from '../types/itineraryQuote.types';
import { calculateItineraryQuoteBreakdown } from './itineraryQuoteCalculator';
import { cloneItineraryQuoteRules, defaultItineraryQuoteRules } from './itineraryQuoteRules';
import {
  sanitizeItineraryQuoteRequest,
  validateItineraryQuoteRequest,
} from './itineraryQuoteValidators';

export interface ItineraryQuoteServiceResult {
  success: boolean;
  message: string;
  data?: ItineraryQuoteResponse;
  errors?: string[];
}

export class ItineraryQuoteService {
  private static instance: ItineraryQuoteService;
  private sequence = 0;

  static getInstance(): ItineraryQuoteService {
    if (!ItineraryQuoteService.instance) {
      ItineraryQuoteService.instance = new ItineraryQuoteService();
    }
    return ItineraryQuoteService.instance;
  }

  validate(input: Partial<ItineraryQuoteRequest>): ItineraryValidationResult {
    const request = sanitizeItineraryQuoteRequest(input);
    return validateItineraryQuoteRequest(request);
  }

  generateQuote(
    input: Partial<ItineraryQuoteRequest>,
    customRules?: Partial<ItineraryQuoteRules>
  ): ItineraryQuoteServiceResult {
    const request = sanitizeItineraryQuoteRequest(input);
    const validation = validateItineraryQuoteRequest(request);

    if (!validation.valid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }

    const { breakdown, appliedPromo } = calculateItineraryQuoteBreakdown(request, customRules);

    return {
      success: true,
      message: 'Itinerary quote generated',
      data: {
        quoteId: this.createQuoteId(),
        generatedAt: new Date().toISOString(),
        currency: 'INR',
        request,
        breakdown,
        appliedPromo,
      },
    };
  }

  getDefaultRules(): ItineraryQuoteRules {
    return cloneItineraryQuoteRules(defaultItineraryQuoteRules);
  }

  private createQuoteId(): string {
    this.sequence += 1;
    const seq = String(this.sequence).padStart(4, '0');
    const stamp = String(Date.now()).slice(-6);
    return `ITQ-${stamp}-${seq}`;
  }
}

export default ItineraryQuoteService;
