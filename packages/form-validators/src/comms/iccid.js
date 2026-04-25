/**
 * Canonical form: trim and strip every space and hyphen.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeIccid(value) {
  if (typeof value !== 'string') return String(value ?? '');
  return value.trim().replace(/[\s-]/g, '');
}

/**
 * Validate an ICCID (SIM card identifier): 19 or 20 digits, must start
 * with the telecommunications industry prefix `89`, and the last digit
 * is a Luhn-style check digit using the variant employed by the legacy
 * VerifyUtils library.
 * @param {unknown} value
 * @returns {boolean}
 */
export function iccid(value) {
  if (typeof value !== 'string') return false;
  if (value.length !== 19 && value.length !== 20) return false;
  if (!/^\d+$/.test(value)) return false;
  if (value.substring(0, 2) !== '89') return false;
  const luhnDigit = parseInt(value.substring(value.length - 1), 10);
  const luhnLess = value.substring(0, value.length - 1);
  return computeIccidCheckDigit(luhnLess) === luhnDigit;
}

/**
 * @param {string} body Digits without the trailing check digit.
 * @returns {number}
 */
function computeIccidCheckDigit(body) {
  let sum = 0;
  for (let i = 0; i < body.length; i += 1) {
    sum += parseInt(body.substring(i, i + 1), 10);
  }
  const delta = [0, 1, 2, 3, 4, -4, -3, -2, -1, 0];
  for (let i = body.length - 1; i >= 0; i -= 2) {
    const idx = parseInt(body.substring(i, i + 1), 10);
    sum += delta[idx];
  }
  let mod = sum % 10;
  mod = 10 - mod;
  if (mod === 10) mod = 0;
  return mod;
}
