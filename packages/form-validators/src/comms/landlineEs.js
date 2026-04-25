/**
 * Validate a Spanish landline / generic 9-digit phone number with optional
 * country prefix (+34, 34, 0034). Spaces and hyphens are tolerated and
 * stripped before matching. Use {@link mobileEs} when you need to restrict
 * to mobiles, or {@link telephoneEs} for either.
 * @param {unknown} value
 * @returns {boolean}
 */
export function landlineEs(value) {
  if (typeof value !== 'string' || value === '') return false;
  const cleaned = value.replace(/[\s-]/g, '');
  return /^(?:\+?[0-9]{2}|00[0-9]{2})?[0-9]{9}$/.test(cleaned);
}

/**
 * Canonical form: trim, strip space/hyphen and any Spanish country prefix.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeLandlineEs(value) {
  if (typeof value !== 'string') return String(value ?? '');
  return value.trim().replace(/[\s-]/g, '').replace(/^(?:\+34|0034|34)/, '');
}
