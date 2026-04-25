/**
 * Validate a Spanish postal code: exactly 5 digits. Leading zeros are
 * legitimate (e.g. `08001` Barcelona, `01001` Vitoria) so we do not use
 * the {@link integer} predicate here — it round-trips through `parseInt`
 * and would reject a leading zero.
 * @param {unknown} value
 * @returns {boolean}
 */
export function postalCodeEs(value) {
  if (typeof value !== 'string') return false;
  return /^\d{5}$/.test(value);
}

/**
 * Canonical form: trim only — leading zeros are significant.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizePostalCodeEs(value) {
  if (typeof value !== 'string') return String(value ?? '');
  return value.trim();
}
