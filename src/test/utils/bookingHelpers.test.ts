import { describe, test, expect } from 'vitest'
import {
  calculateAdvanceAmount,
  calculateTotalCost,
  formatPrice,
  calculateBalance,
  isValidContactNumber,
  generateId,
} from '../../utils/bookingHelpers'

describe('calculateAdvanceAmount', () => {
  test('calculates advance for 3 pax', () => {
    expect(calculateAdvanceAmount(3)).toBe(7500)
  })

  test('calculates with custom cost per pax', () => {
    expect(calculateAdvanceAmount(2, 3000)).toBe(6000)
  })

  test('returns 0 for null pax', () => {
    expect(calculateAdvanceAmount(null)).toBe(0)
  })

  test('returns 0 for undefined pax', () => {
    expect(calculateAdvanceAmount(undefined)).toBe(0)
  })

  test('returns 0 for negative pax', () => {
    expect(calculateAdvanceAmount(-2)).toBe(0)
  })

  test('returns 0 for zero pax', () => {
    expect(calculateAdvanceAmount(0)).toBe(0)
  })

  test('returns 0 for NaN', () => {
    expect(calculateAdvanceAmount(NaN)).toBe(0)
  })
})

describe('calculateTotalCost', () => {
  test('calculates total from customer details', () => {
    const customers = [
      { package_cost: 5000, discounted_package_cost: 4000 },
      { package_cost: 5000, discounted_package_cost: 4000 },
    ]
    expect(calculateTotalCost(customers)).toBe(10000)
  })

  test('uses discounted price when flag is true', () => {
    const customers = [
      { package_cost: 5000, discounted_package_cost: 4000 },
      { package_cost: 5000, discounted_package_cost: 4000 },
    ]
    expect(calculateTotalCost(customers, true)).toBe(8000)
  })

  test('returns 0 for null customers', () => {
    expect(calculateTotalCost(null)).toBe(0)
  })

  test('returns 0 for empty array', () => {
    expect(calculateTotalCost([])).toBe(0)
  })

  test('handles missing cost fields', () => {
    const customers = [
      { package_cost: 0, discounted_package_cost: 0 },
    ]
    expect(calculateTotalCost(customers)).toBe(0)
  })
})

describe('formatPrice', () => {
  test('formats a price with rupee symbol', () => {
    expect(formatPrice(5000)).toBe('₹5,000')
  })

  test('rounds decimal amounts', () => {
    expect(formatPrice(4999.7)).toBe('₹5,000')
  })

  test('returns ₹0 for null', () => {
    expect(formatPrice(null)).toBe('₹0')
  })

  test('returns ₹0 for undefined', () => {
    expect(formatPrice(undefined)).toBe('₹0')
  })

  test('returns ₹0 for NaN', () => {
    expect(formatPrice(NaN)).toBe('₹0')
  })

  test('formats zero', () => {
    expect(formatPrice(0)).toBe('₹0')
  })
})

describe('calculateBalance', () => {
  test('calculates remaining balance', () => {
    expect(calculateBalance(10000, 2500)).toBe(7500)
  })

  test('returns 0 when fully paid', () => {
    expect(calculateBalance(5000, 5000)).toBe(0)
  })

  test('returns 0 when overpaid', () => {
    expect(calculateBalance(5000, 6000)).toBe(0)
  })

  test('returns total when nothing paid', () => {
    expect(calculateBalance(5000, null)).toBe(5000)
  })

  test('returns 0 for null total', () => {
    expect(calculateBalance(null, 1000)).toBe(0)
  })
})

describe('isValidContactNumber', () => {
  test('validates correct Indian number', () => {
    expect(isValidContactNumber('9876543210')).toBe(true)
  })

  test('validates number with dashes', () => {
    expect(isValidContactNumber('987-654-3210')).toBe(true)
  })

  test('rejects number starting with 5', () => {
    expect(isValidContactNumber('5876543210')).toBe(false)
  })

  test('rejects short number', () => {
    expect(isValidContactNumber('98765')).toBe(false)
  })

  test('rejects null', () => {
    expect(isValidContactNumber(null)).toBe(false)
  })

  test('rejects empty string', () => {
    expect(isValidContactNumber('')).toBe(false)
  })
})

describe('generateId', () => {
  test('generates a string starting with underscore', () => {
    const id = generateId()
    expect(id).toMatch(/^_[a-z0-9]+$/)
  })

  test('generates unique ids', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })
})
