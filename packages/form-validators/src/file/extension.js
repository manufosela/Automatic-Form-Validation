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
