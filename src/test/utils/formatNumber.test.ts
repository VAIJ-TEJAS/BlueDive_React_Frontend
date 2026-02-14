import { describe, test, expect } from 'vitest'
import { formatNumber } from '../../utils/formatNumber'

describe('formatNumber - P2P tests', () => {
  // These tests should pass on both base and head
  test('formats a simple number', () => {
    expect(formatNumber(1000)).toBe('1,000')
  })

  test('formats a large number with Indian grouping', () => {
    expect(formatNumber(100000)).toBe('1,00,000')
  })

  test('formats zero', () => {
    expect(formatNumber(0)).toBe('0')
  })

  test('formats negative number', () => {
    expect(formatNumber(-5000)).toBe('-5,000')
  })

  test('formats decimal number', () => {
    const result = formatNumber(1234.56)
    expect(result).toContain('1,234')
  })
})

describe('formatNumber - F2P tests', () => {
  // These tests fail on base (crash) but pass after fix
  test('handles null input without crashing', () => {
    expect(formatNumber(null as any)).toBe('0')
  })

  test('handles undefined input without crashing', () => {
    expect(formatNumber(undefined as any)).toBe('0')
  })

  test('handles NaN input without crashing', () => {
    expect(formatNumber(NaN)).toBe('0')
  })
})
