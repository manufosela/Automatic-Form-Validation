/**
 * Validate a Spanish mobile phone number: 9 digits starting with 6 or 7,
 * with an optional country prefix (+34, 34, 0034). Spaces and hyphens
 * anywhere in the number are tolerated and stripped before matching.
 * @param {unknown} value
 * @returns {boolean}
 */
export function mobileEs(value) {
  if (typeof value !== 'string' || value === '') return false;
  const cleaned = value.replace(/[\s-]/g, '');
  return /^(?:\+?[0-9]{2}|00[0-9]{2})?(?:6|7)[0-9]{8}$/.test(cleaned);
}

/**
 * Canonical form: trim, strip every space/hyphen and any Spanish country
 * prefix (`+34`, `0034`, `34`). Returns just the 9 local digits.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeMobileEs(value) {
  if (typeof value !== 'string') return String(value ?? '');
  return value.trim().replace(/[\s-]/g, '').replace(/^(?:\+34|0034|34)/, '');
}
