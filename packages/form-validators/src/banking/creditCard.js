/**
 * Validate a 16-digit credit card number using the Luhn algorithm. The
 * leading digit must be one of 3 (Amex/Diners), 4 (Visa), 5 (Mastercard)
 * or 6 (Discover) — matching the legacy `verificaNumTarjetaCredito`
 * acceptance set in VerifyUtils.
 * @param {unknown} value
 * @returns {boolean}
 */
export function creditCard(value) {
  if (typeof value !== 'string' || value.length !== 16 || !/^\d{16}$/.test(value)) {
    return false;
  }
  if (![3, 4, 5, 6].includes(parseInt(value.charAt(0), 10))) return false;
  return computeLuhnCheckDigit(value.substring(0, 15)) === parseInt(value.charAt(15), 10);
}

/**
 * @param {string} body 15-digit body without the check digit.
 * @returns {number}
 */
function computeLuhnCheckDigit(body) {
  let sum = 0;
  for (let i = 1; i <= 15; i += 1) {
    const n = parseInt(body.charAt(i - 1), 10);
    if (i % 2 !== 0) {
      const doubled = n * 2;
      sum += doubled >= 10 ? doubled - 9 : doubled;
    } else {
      sum += n;
    }
  }
  let mod = 10 - (sum % 10);
  if (mod === 10) mod = 0;
  return mod;
}
