import { dniLetterFor, cifControlChars } from './_dni-letter.js';

/**
 * Canonical form: trim, uppercase, strip internal whitespace and hyphens.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeNif(value) {
  if (typeof value !== 'string') return String(value ?? '');
  return value.trim().replace(/[\s-]/g, '').toUpperCase();
}

/**
 * Validate a Spanish NIF (Número de Identificación Fiscal). Covers:
 * - Standard NIF: 8 digits + control letter from the official table.
 * - Special NIF (KLM): starts with K, L or M; the control character is
 *   computed using the CIF algorithm and must match the LETTER form.
 * @param {unknown} value
 * @returns {boolean}
 */
export function nif(value) {
  if (typeof value !== 'string' || value === '') return false;
  const v = value.toUpperCase();
  // Standard NIF: 8 digits + 1 letter.
  if (/^\d{8}[A-Z]$/.test(v)) {
    const body = parseInt(v.substring(0, 8), 10);
    return dniLetterFor(body) === v.charAt(8);
  }
  // Special K/L/M NIFs use the CIF algorithm against the letter form.
  if (/^[KLM]\d{7}[A-Z]$/.test(v)) {
    const body = v.substring(1, 8);
    return cifControlChars(body).letter === v.charAt(8);
  }
  return false;
}
