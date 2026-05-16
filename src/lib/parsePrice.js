/**
 * Parses a user-entered price string into a finite number, or NaN.
 */
export function parsePrice(raw) {
  const n = Number.parseFloat(String(raw).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : NaN
}
