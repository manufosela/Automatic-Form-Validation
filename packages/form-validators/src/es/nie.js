import { dniLetterFor } from './_dni-letter.js';

/**
 * Validate a Spanish NIE (Número de Identidad de Extranjero). Two formats:
 * - Modern: starts with X, Y or Z + 7 digits + control letter. The leading
 *   letter maps to a digit (X→0, Y→1, Z→2), and the resulting 8-digit
 *   number is verified with the standard DNI letter table.
 * - Historical T-prefix: starts with T followed by 8 alphanumerics. There
 *   is no official check digit for this form, so we only validate the
 *   shape.
 * @param {unknown} value
 * @returns {boolean}
 */
export function nie(value) {
  if (typeof value !== 'string' || value === '') return false;
  const v = value.toUpperCase();
  if (/^T[A-Z0-9]{8}$/.test(v)) return true;
  if (/^[XYZ]\d{7}[A-Z]$/.test(v)) {
    const swapped = v.replace(/^X/, '0').replace(/^Y/, '1').replace(/^Z/, '2');
    const body = parseInt(swapped.substring(0, 8), 10);
    return dniLetterFor(body) === v.charAt(8);
  }
  return false;
}
