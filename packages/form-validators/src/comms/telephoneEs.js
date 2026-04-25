import { mobileEs, normalizeMobileEs } from './mobileEs.js';
import { landlineEs } from './landlineEs.js';

/**
 * Validate any Spanish phone number — mobile or landline.
 * @param {unknown} value
 * @returns {boolean}
 */
export function telephoneEs(value) {
  return mobileEs(value) || landlineEs(value);
}

/**
 * Canonical form: same rules as mobile / landline normalize (they share
 * the strip-prefix-and-separators logic).
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeTelephoneEs(value) {
  return normalizeMobileEs(value);
}
