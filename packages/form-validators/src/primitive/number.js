/**
 * Validate that the input is composed of digits and optional decimal points.
 * Mirrors the legacy `isNumber` predicate from VerifyUtils. For stricter
 * integer/float checks see {@link integer} and {@link float}.
 * @param {unknown} value
 * @returns {boolean}
 */
export function number(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return false;
  return /^[0-9.]+$/.test(String(value));
}

/**
 * Canonical form: trim and accept comma as decimal separator.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeNumber(value) {
  if (typeof value === 'number') return String(value);
  if (typeof value !== 'string') return String(value ?? '');
  return value.trim().replace(',', '.');
}
