import { describe, it, expect } from 'vitest';
import { fileExtension } from '../src/index.js';

describe('fileExtension', () => {
  it('accepts files matching the allowed extensions', () => {
    expect(fileExtension('cv.pdf', ['.pdf', '.doc'])).toBe(true);
    expect(fileExtension('photo.JPG', ['.JPG', '.PNG'])).toBe(true);
  });
  it('rejects mismatching extension', () => {
    expect(fileExtension('cv.txt', ['.pdf', '.doc'])).toBe(false);
  });
  it('is case-sensitive', () => {
    expect(fileExtension('cv.PDF', ['.pdf'])).toBe(false);
  });
  it('rejects empty/garbage input', () => {
    expect(fileExtension('', ['.pdf'])).toBe(false);
    expect(fileExtension('cv.pdf', [])).toBe(false);
    expect(fileExtension('cv.pdf', /** @type {any} */ (null))).toBe(false);
  });
});
