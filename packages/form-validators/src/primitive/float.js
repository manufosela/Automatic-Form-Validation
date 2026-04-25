/**
 * Validate that the input is a finite floating-point number. Strings that
 * parse cleanly to a number are accepted (e.g. "3.14", "-0.5", "10").
 * @param {unknown} value
 * @returns {boolean}
 */
export function float(value) {
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value !== 'string' || value.trim() === '') return false;
  const parsed = parseFloat(value);
  if (!Number.isFinite(parsed)) return false;
  // Reject things like "3.14abc" that parseFloat is otherwise lenient about.
  return /^-?\d+(?:\.\d+)?$/.test(value.trim());
}
