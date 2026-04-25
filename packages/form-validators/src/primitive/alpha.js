// Latin alphabet with Spanish + accented characters. Mirrors the legacy
// regex from VerifyUtils.isAlpha so behaviour stays identical.
const LETTERS = "A-Za-z\\xF1\\xD1áéíóúÁÉÍÓÚäëïöüAËÏÖÜÑñçÇ'";

/**
 * True when the value is composed only of letters (incl. ñ, accents, ç)
 * and whitespace. Empty strings return `false`.
 * @param {unknown} value
 * @returns {boolean}
 */
export function alpha(value) {
  if (typeof value !== 'string' || value === '') return false;
  return new RegExp(`^[${LETTERS}\\s]+$`).test(value);
}

/**
 * Like {@link alpha} but also allows hyphens (e.g. "Pérez-Galdós").
 * @param {unknown} value
 * @returns {boolean}
 */
export function alphaWithDash(value) {
  if (typeof value !== 'string' || value === '') return false;
  return new RegExp(`^[${LETTERS}\\s-]+$`).test(value);
}

/**
 * Letters plus digits, no spaces.
 * @param {unknown} value
 * @returns {boolean}
 */
export function alphanumeric(value) {
  if (typeof value !== 'string' || value === '') return false;
  return new RegExp(`^[0-9${LETTERS}]+$`).test(value);
}

/**
 * Letters plus digits plus whitespace.
 * @param {unknown} value
 * @returns {boolean}
 */
export function alphanumericWithSpace(value) {
  if (typeof value !== 'string' || value === '') return false;
  return new RegExp(`^[0-9${LETTERS}\\s]+$`).test(value);
}
