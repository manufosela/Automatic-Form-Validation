import { mobileEs } from './mobileEs.js';
import { landlineEs } from './landlineEs.js';

/**
 * Validate any Spanish phone number — mobile or landline.
 * @param {unknown} value
 * @returns {boolean}
 */
export function telephoneEs(value) {
  return mobileEs(value) || landlineEs(value);
}
