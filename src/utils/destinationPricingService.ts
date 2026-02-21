import {
  DestinationPricingRequest,
  DestinationPricingResponse,
  DestinationPricingRules,
  DestinationPricingValidationResult,
} from '../types/destinationPricing.types';
import { calculateDestinationPricingBreakdown } from './destinationPricingCalculator';
import {
  cloneDestinationPricingRules,
  defaultDestinationPricingRules,
} from './destinationPricingRules';
import {
  sanitizeDestinationPricingRequest,
  validateDestinationPricingRequest,
} from './destinationPricingValidators';

export interface DestinationPricingServiceResult {
  success: boolean;
  message: string;
  data?: DestinationPricingResponse;
  errors?: string[];
}

export class DestinationPricingService {
  private static instance: DestinationPricingService;
  private sequence = 0;

  static getInstance(): DestinationPricingService {
    if (!DestinationPricingService.instance) {
      DestinationPricingService.instance = new DestinationPricingService();
    }
    return DestinationPricingService.instance;
  }

  validate(input: Partial<DestinationPricingRequest>): DestinationPricingValidationResult {
    const req = sanitizeDestinationPricingRequest(input);
    return validateDestinationPricingRequest(req);
  }

  generateQuote(
    input: Partial<DestinationPricingRequest>,
    customRules?: Partial<DestinationPricingRules>
  ): DestinationPricingServiceResult {
    const request = sanitizeDestinationPricingRequest(input);
    const validation = validateDestinationPricingRequest(request);

    if (!validation.valid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }

    const { breakdown, appliedCoupon } = calculateDestinationPricingBreakdown(request, customRules);

    return {
      success: true,
      message: 'Destination pricing quote generated',
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

  getDefaultRules(): DestinationPricingRules {
    return cloneDestinationPricingRules(defaultDestinationPricingRules);
  }

  private createQuoteId(): string {
    this.sequence += 1;
    const seq = String(this.sequence).padStart(4, '0');
    const stamp = String(Date.now()).slice(-6);
    return `DPQ-${stamp}-${seq}`;
  }
}

export default DestinationPricingService;
