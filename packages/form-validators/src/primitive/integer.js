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
