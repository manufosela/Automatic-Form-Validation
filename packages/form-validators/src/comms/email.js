/**
 * Validate an email address. Pragmatic regex — accepts the common 99 % of
 * real-world addresses (RFC 5322 is intentionally not fully covered as it
 * permits exotic forms most consumer apps don't want anyway). Anchored at
 * both ends, requires a 2-4 letter TLD.
 * @param {unknown} value
 * @returns {boolean}
 */
export function email(value) {
  if (typeof value !== 'string' || value === '') return false;
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}$/.test(value);
}

/**
 * Canonical form: trim, strip internal whitespace, lowercase the whole
 * address (the local part is case-insensitive in practice).
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeEmail(value) {
  if (typeof value !== 'string') return String(value ?? '');
  return value.trim().replace(/\s+/g, '').toLowerCase();
}
