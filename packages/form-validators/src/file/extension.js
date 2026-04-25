/**
 * Check that a filename ends with one of the allowed extensions.
 * Comparison is case-sensitive — pass extensions in the case you expect.
 * @param {unknown} filename
 * @param {string[]} validExtensions Extensions WITH the leading dot, e.g. `['.pdf', '.doc']`.
 * @returns {boolean}
 */
export function fileExtension(filename, validExtensions) {
  if (typeof filename !== 'string' || filename === '') return false;
  if (!Array.isArray(validExtensions) || validExtensions.length === 0) return false;
  return validExtensions.some((ext) => typeof ext === 'string' && filename.endsWith(ext));
}

/**
 * Canonical form: just trim. Filenames are case-sensitive on most systems
 * so we don't lower/uppercase here.
 * @param {unknown} filename
 * @returns {string}
 */
export function normalizeFileExtension(filename) {
  if (typeof filename !== 'string') return String(filename ?? '');
  return filename.trim();
}
