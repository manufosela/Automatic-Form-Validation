/**
 * Canonical form: trim and strip every space and hyphen so a CCC dictated
 * with separators (`2100 0418 4502 0000 5678`) becomes a 20-digit string.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeBankAccountEs(value) {
  if (typeof value !== 'string') return String(value ?? '');
  return value.trim().replace(/[\s-]/g, '');
}

/**
 * Validate a Spanish bank account number in the legacy CCC format
 * (20 digits: 4 bank + 4 branch + 2 control + 10 account). The two control
 * digits are computed from the bank+branch and account parts respectively
 * using the historical Spanish weighting algorithm.
 * @param {unknown} value
 * @returns {boolean}
 */
export function bankAccountEs(value) {
  if (typeof value !== 'string' || value.length !== 20 || !/^\d{20}$/.test(value)) {
    return false;
  }
  const part1 = `00${value.substring(0, 8)}`; // bank+branch padded to 10
  const control = value.substring(8, 10);
  const part2 = value.substring(10); // 10-digit account
  const weights = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6];
  const checkDigit = (digits) => {
    let sum = 0;
    for (let i = 0; i < 10; i += 1) sum += parseInt(digits.charAt(i), 10) * weights[i];
    let d = 11 - (sum % 11);
    if (d === 11) d = 0;
    if (d === 10) d = 1;
    return d;
  };
  return `${checkDigit(part1)}${checkDigit(part2)}` === control;
}
