/**
 * Canonical form: trim and pad day/month with leading zero. Picks `/` as
 * separator. The mode (`dmy` / `mdy` / `ymd`) is used to know which of the
 * three numeric segments is which.
 * @param {unknown} value
 * @param {'dmy' | 'mdy' | 'ymd'} [mode] Default `'dmy'`.
 * @returns {string}
 */
export function normalizeDate(value, mode = 'dmy') {
  if (typeof value !== 'string') return String(value ?? '');
  const trimmed = value.trim();
  const m = trimmed.match(/^(\d{1,4})(?:\/|-)(\d{1,2})(?:\/|-)(\d{1,4})$/);
  if (!m) return trimmed;
  const [, a, b, c] = m;
  const pad = (s, n = 2) => s.padStart(n, '0');
  if (mode === 'mdy') return `${pad(a)}/${pad(b)}/${pad(c, 4)}`;
  if (mode === 'ymd') return `${pad(a, 4)}/${pad(b)}/${pad(c)}`;
  return `${pad(a)}/${pad(b)}/${pad(c, 4)}`;
}

/**
 * Validate a calendar date in `dd/mm/yyyy`, `mm/dd/yyyy` or `yyyy-mm-dd`
 * format (configurable via `mode`). Checks month range, day range, days
 * per month and leap years. Separators may be `/` or `-`.
 * @param {unknown} value
 * @param {'dmy' | 'mdy' | 'ymd'} [mode] Default `'dmy'`.
 * @returns {boolean}
 */
export function date(value, mode = 'dmy') {
  if (typeof value !== 'string' || value === '') return false;
  const m = value.match(/^(\d{1,4})(\/|-)(\d{1,2})(\/|-)(\d{1,4})$/);
  if (!m) return false;
  let day;
  let month;
  let year;
  if (mode === 'mdy') {
    [, month, , day, , year] = m;
  } else if (mode === 'ymd') {
    [, year, , month, , day] = m;
  } else {
    [, day, , month, , year] = m;
  }
  const d = Number(day);
  const mo = Number(month);
  const y = Number(year);
  if (mo < 1 || mo > 12) return false;
  if (d < 1 || d > 31) return false;
  if (y < 1 || y > 9999) return false;
  if ([4, 6, 9, 11].includes(mo) && d === 31) return false;
  if (mo === 2) {
    const isLeap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
    if (d > 29 || (d === 29 && !isLeap)) return false;
  }
  return true;
}
