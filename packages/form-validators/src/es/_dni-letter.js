/**
 * Internal: compute the control letter for a DNI/NIF given its 8-digit
 * numeric body. Uses the official lookup table.
 * @param {number} bodyAsNumber
 * @returns {string}
 */
export function dniLetterFor(bodyAsNumber) {
  const TABLE = 'TRWAGMYFPDXBNJZSQVHLCKE';
  return TABLE.charAt(bodyAsNumber % 23);
}

/**
 * Internal: compute the CIF check character (digit OR letter) for a CIF
 * body of 7 digits (positions 1..7 of the CIF, after the entity letter).
 * @param {string} body Seven digits.
 * @returns {{ digit: string, letter: string }}
 */
export function cifControlChars(body) {
  let sum = parseInt(body.charAt(1), 10) + parseInt(body.charAt(3), 10) + parseInt(body.charAt(5), 10);
  for (let i = 0; i < 7; i += 2) {
    let doubled = (2 * parseInt(body.charAt(i), 10)).toString();
    if (doubled.length === 1) doubled = `0${doubled}`;
    sum += parseInt(doubled.charAt(0), 10) + parseInt(doubled.charAt(1), 10);
  }
  const lastDigitOfSum = sum % 10;
  const n = lastDigitOfSum === 0 ? 0 : 10 - lastDigitOfSum;
  return {
    digit: String(n % 10),
    letter: String.fromCharCode(64 + (n === 0 ? 10 : n)),
  };
}
