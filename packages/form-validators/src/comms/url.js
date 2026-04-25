/**
 * Validate an http(s) URL. Anchored at both ends so we don't accept text
 * with a URL embedded in it. Path/query/fragment are optional.
 * @param {unknown} value
 * @returns {boolean}
 */
export function url(value) {
  if (typeof value !== 'string' || value === '') return false;
  return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{2,24}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
    value,
  );
}
