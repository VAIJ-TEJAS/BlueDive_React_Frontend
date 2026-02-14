import { describe, test, expect } from 'vitest'
import {
  formatDisplayDate,
  formatDateRange,
  isDatePast,
  daysUntil,
  getTripDuration,
} from '../../utils/dateUtils'

describe('formatDisplayDate', () => {
  test('formats a valid date string', () => {
    expect(formatDisplayDate('2025-03-15')).toBe('15 Mar 25')
  })

  test('returns N/A for null', () => {
    expect(formatDisplayDate(null)).toBe('N/A')
  })

  test('returns N/A for undefined', () => {
    expect(formatDisplayDate(undefined)).toBe('N/A')
  })

  test('returns N/A for empty string', () => {
    expect(formatDisplayDate('')).toBe('N/A')
  })

  test('returns Invalid Date for bad input', () => {
    expect(formatDisplayDate('not-a-date')).toBe('Invalid Date')
  })
})

describe('formatDateRange', () => {
  test('formats a valid date range', () => {
    expect(formatDateRange('2025-03-15', '2025-03-17')).toBe('15 Mar 25 - 17 Mar 25')
  })

  test('returns empty for null start', () => {
    expect(formatDateRange(null, '2025-03-17')).toBe('')
  })

  test('returns empty for null end', () => {
    expect(formatDateRange('2025-03-15', null)).toBe('')
  })

  test('returns empty for invalid dates', () => {
    expect(formatDateRange('bad', 'also-bad')).toBe('')
  })
})

describe('isDatePast', () => {
  test('returns true for past date', () => {
    expect(isDatePast('2020-01-01')).toBe(true)
  })

  test('returns false for future date', () => {
    expect(isDatePast('2099-12-31')).toBe(false)
  })

  test('returns true for null', () => {
    expect(isDatePast(null)).toBe(true)
  })

  test('returns true for invalid date', () => {
    expect(isDatePast('not-a-date')).toBe(true)
  })
})

describe('daysUntil', () => {
  test('returns positive for future date', () => {
    const future = new Date()
    future.setDate(future.getDate() + 10)
    expect(daysUntil(future.toISOString())).toBe(10)
  })

  test('returns negative for past date', () => {
    const past = new Date()
    past.setDate(past.getDate() - 5)
    expect(daysUntil(past.toISOString())).toBe(-5)
  })

  test('returns 0 for null', () => {
    expect(daysUntil(null)).toBe(0)
  })

  test('returns 0 for invalid date', () => {
    expect(daysUntil('bad-date')).toBe(0)
  })
})

describe('getTripDuration', () => {
  test('calculates 2 day trip', () => {
    expect(getTripDuration('2025-03-15', '2025-03-17')).toBe('2 days')
  })

  test('calculates 1 day trip', () => {
    expect(getTripDuration('2025-03-15', '2025-03-16')).toBe('1 day')
  })

  test('returns empty for null start', () => {
    expect(getTripDuration(null, '2025-03-17')).toBe('')
  })

  test('returns empty for null end', () => {
    expect(getTripDuration('2025-03-15', null)).toBe('')
  })

  test('returns empty for same date', () => {
    expect(getTripDuration('2025-03-15', '2025-03-15')).toBe('')
  })

  test('returns empty for invalid dates', () => {
    expect(getTripDuration('bad', 'also-bad')).toBe('')
  })
})
