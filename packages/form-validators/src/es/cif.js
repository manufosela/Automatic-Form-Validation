import { cifControlChars } from './_dni-letter.js';

/**
 * Canonical form: trim, uppercase, strip internal whitespace and hyphens.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeCif(value) {
  if (typeof value !== 'string') return String(value ?? '');
  return value.trim().replace(/[\s-]/g, '').toUpperCase();
}

/**
 * Validate a Spanish CIF (Código de Identificación Fiscal). Format: an
 * entity letter (A-H, J, N, P, Q, R, S, U, V, W) + 7 digits + control
 * character which is either a digit or a letter depending on the entity
 * type.
 * @param {unknown} value
 * @returns {boolean}
 */
export function cif(value) {
  if (typeof value !== 'string' || value === '') return false;
  const v = value.toUpperCase();
  if (!/^[ABCDEFGHJNPQRSUVW]\d{7}[A-Z0-9]$/.test(v)) return false;
  const body = v.substring(1, 8);
  const expected = cifControlChars(body);
  const last = v.charAt(8);
  return last === expected.digit || last === expected.letter;
}
