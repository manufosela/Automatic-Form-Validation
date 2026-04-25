/**
 * Validate that the input is an integer. Accepts both numeric and string
 * inputs as long as the parsed integer round-trips losslessly.
 * @param {unknown} value
 * @returns {boolean}
 */
export function integer(value) {
  if (typeof value === 'number') return Number.isInteger(value);
  if (typeof value !== 'string' || value.trim() === '') return false;
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) return false;
  return String(parsed) === value.trim();
}

/**
 * Canonical form: trim and convert to a digit-only string. Returns the
 * input untouched when it can't be cleanly normalized so the predicate
 * can still report it as invalid.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeInteger(value) {
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : String(value);
  if (typeof value !== 'string') return String(value ?? '');
  return value.trim();
}
