import { describe, test, expect } from 'vitest'
import {
  hasAvailableSeats,
  formatSeats,
  getTripStatusLabel,
  getTripStatusColor,
  isCancellable,
  formatDiscountBadge,
} from '../../utils/tripHelpers'

describe('hasAvailableSeats', () => {
  test('returns true when seats available', () => {
    expect(hasAvailableSeats(5)).toBe(true)
  })

  test('returns false for zero seats', () => {
    expect(hasAvailableSeats(0)).toBe(false)
  })

  test('returns false for null', () => {
    expect(hasAvailableSeats(null)).toBe(false)
  })

  test('returns false for undefined', () => {
    expect(hasAvailableSeats(undefined)).toBe(false)
  })
})

describe('formatSeats', () => {
  test('pads single digit', () => {
    expect(formatSeats(5)).toBe('05')
  })

  test('does not pad double digit', () => {
    expect(formatSeats(15)).toBe('15')
  })

  test('returns 00 for null', () => {
    expect(formatSeats(null)).toBe('00')
  })

  test('returns 00 for NaN', () => {
    expect(formatSeats(NaN)).toBe('00')
  })

  test('handles zero', () => {
    expect(formatSeats(0)).toBe('00')
  })

  test('handles negative by clamping to 0', () => {
    expect(formatSeats(-3)).toBe('00')
  })
})

describe('getTripStatusLabel', () => {
  test('returns Upcoming for Scheduled', () => {
    expect(getTripStatusLabel('Scheduled')).toBe('Upcoming')
  })

  test('returns In Progress for Ongoing', () => {
    expect(getTripStatusLabel('Ongoing')).toBe('In Progress')
  })

  test('returns Completed', () => {
    expect(getTripStatusLabel('Completed')).toBe('Completed')
  })

  test('returns Cancelled', () => {
    expect(getTripStatusLabel('Cancelled')).toBe('Cancelled')
  })

  test('returns Unknown for null', () => {
    expect(getTripStatusLabel(null)).toBe('Unknown')
  })

  test('returns Unknown for unrecognized status', () => {
    expect(getTripStatusLabel('SomeOther')).toBe('Unknown')
  })
})

describe('getTripStatusColor', () => {
  test('returns blue for Scheduled', () => {
    expect(getTripStatusColor('Scheduled')).toBe('text-blue-500')
  })

  test('returns green for Ongoing', () => {
    expect(getTripStatusColor('Ongoing')).toBe('text-green-500')
  })

  test('returns red for Cancelled', () => {
    expect(getTripStatusColor('Cancelled')).toBe('text-red-500')
  })

  test('returns gray for null', () => {
    expect(getTripStatusColor(null)).toBe('text-gray-500')
  })
})

describe('isCancellable', () => {
  test('returns true for Partially Confirmed', () => {
    expect(isCancellable('Partially Confirmed')).toBe(true)
  })

  test('returns true for Confirmed', () => {
    expect(isCancellable('Confirmed')).toBe(true)
  })

  test('returns false for Cancelled', () => {
    expect(isCancellable('Cancelled')).toBe(false)
  })

  test('returns false for null', () => {
    expect(isCancellable(null)).toBe(false)
  })
})

describe('formatDiscountBadge', () => {
  test('formats 20 percent', () => {
    expect(formatDiscountBadge(20)).toBe('20% Off')
  })

  test('rounds decimal percentage', () => {
    expect(formatDiscountBadge(19.5)).toBe('20% Off')
  })

  test('returns empty for null', () => {
    expect(formatDiscountBadge(null)).toBe('')
  })

  test('returns empty for zero', () => {
    expect(formatDiscountBadge(0)).toBe('')
  })

  test('returns empty for negative', () => {
    expect(formatDiscountBadge(-10)).toBe('')
  })

  test('returns empty for NaN', () => {
    expect(formatDiscountBadge(NaN)).toBe('')
  })
})
