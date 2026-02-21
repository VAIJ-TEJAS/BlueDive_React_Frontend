import {
  GearRentalQuoteRequest,
  GearRentalQuoteResponse,
  GearRentalQuoteRules,
  GearRentalValidationResult,
} from '../types/gearRentalQuote.types';
import { calculateGearRentalQuoteBreakdown } from './gearRentalQuoteCalculator';
import { cloneGearRentalQuoteRules, defaultGearRentalQuoteRules } from './gearRentalQuoteRules';
import {
  sanitizeGearRentalQuoteRequest,
  validateGearRentalQuoteRequest,
} from './gearRentalQuoteValidators';

export interface GearRentalQuoteServiceResult {
  success: boolean;
  message: string;
  data?: GearRentalQuoteResponse;
  errors?: string[];
}

export class GearRentalQuoteService {
  private static instance: GearRentalQuoteService;
  private sequence = 0;

  static getInstance(): GearRentalQuoteService {
    if (!GearRentalQuoteService.instance) {
      GearRentalQuoteService.instance = new GearRentalQuoteService();
    }
    return GearRentalQuoteService.instance;
  }

  validate(input: Partial<GearRentalQuoteRequest>): GearRentalValidationResult {
    const request = sanitizeGearRentalQuoteRequest(input);
    return validateGearRentalQuoteRequest(request);
  }

  generateQuote(
    input: Partial<GearRentalQuoteRequest>,
    customRules?: Partial<GearRentalQuoteRules>
  ): GearRentalQuoteServiceResult {
    const request = sanitizeGearRentalQuoteRequest(input);
    const validation = validateGearRentalQuoteRequest(request);

    if (!validation.valid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      };
    }

    const { breakdown, appliedCoupon } = calculateGearRentalQuoteBreakdown(request, customRules);

    return {
      success: true,
      message: 'Gear rental quote generated',
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

  getDefaultRules(): GearRentalQuoteRules {
    return cloneGearRentalQuoteRules(defaultGearRentalQuoteRules);
  }

  private createQuoteId(): string {
    this.sequence += 1;
    const seq = String(this.sequence).padStart(4, '0');
    const stamp = String(Date.now()).slice(-6);
    return `GRQ-${stamp}-${seq}`;
  }
}

export default GearRentalQuoteService;
