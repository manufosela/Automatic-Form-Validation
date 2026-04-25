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

/**
 * Canonical form: trim and prepend `https://` when the user-typed value
 * starts directly with a domain. Lowercases the scheme + host. Path,
 * query and fragment are kept as-is.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeUrl(value) {
  if (typeof value !== 'string') return String(value ?? '');
  let v = value.trim();
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(v)) v = `https://${v}`;
  // Lowercase scheme + host but preserve path/query/fragment casing.
  const m = v.match(/^([a-zA-Z][a-zA-Z0-9+.-]*:\/\/)([^/?#]+)(.*)$/);
  if (!m) return v;
  return `${m[1].toLowerCase()}${m[2].toLowerCase()}${m[3]}`;
}
