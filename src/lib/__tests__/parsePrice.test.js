import { describe, expect, it } from 'vitest'
import { parsePrice } from '../parsePrice.js'

describe('parsePrice', () => {
  it('parses plain decimals', () => {
    expect(parsePrice('12.5')).toBe(12.5)
  })

  it('strips currency symbols', () => {
    expect(parsePrice('$14.00')).toBe(14)
  })

  it('returns NaN for empty or invalid input', () => {
    expect(Number.isNaN(parsePrice(''))).toBe(true)
    expect(Number.isNaN(parsePrice('abc'))).toBe(true)
  })
})
