import { describe, it, expect } from 'vitest';
import {
  normalizeInteger,
  normalizeFloat,
  normalizeNumber,
  normalizeAlpha,
  normalizeAlphaWithDash,
  normalizeAlphanumeric,
  normalizeAlphanumericWithSpace,
  normalizeDate,
  normalizeFileExtension,
  normalizeEmail,
  normalizeUrl,
  normalizeMobileEs,
  normalizeLandlineEs,
  normalizeTelephoneEs,
  normalizePostalCodeEs,
  normalizeIccid,
  normalizeNif,
  normalizeNie,
  normalizeCif,
  normalizeBankAccountEs,
  normalizeCreditCard,
  normalize,
  normalizers,
} from '../src/index.js';

describe('normalizeInteger / Float / Number', () => {
  it('trims', () => {
    expect(normalizeInteger(' 42 ')).toBe('42');
    expect(normalizeFloat(' 3.14 ')).toBe('3.14');
    expect(normalizeNumber(' 1.5 ')).toBe('1.5');
  });
  it('accepts comma as decimal separator (float / number)', () => {
    expect(normalizeFloat('3,14')).toBe('3.14');
    expect(normalizeNumber('3,14')).toBe('3.14');
  });
  it('coerces non-strings to strings', () => {
    expect(normalizeInteger(42)).toBe('42');
    expect(normalizeFloat(3.14)).toBe('3.14');
    expect(normalizeInteger(null)).toBe('');
  });
});

describe('alpha-family normalizers', () => {
  it('trims and collapses internal whitespace runs', () => {
    expect(normalizeAlpha('  Manu   Fosela  ')).toBe('Manu Fosela');
    expect(normalizeAlphaWithDash('  Pérez   -   Galdós  ')).toBe('Pérez - Galdós');
    expect(normalizeAlphanumericWithSpace('  abc   123  ')).toBe('abc 123');
  });
  it('alphanumeric (no space) only trims', () => {
    expect(normalizeAlphanumeric('  abc123  ')).toBe('abc123');
  });
});

describe('normalizeDate', () => {
  it('trims, pads single-digit segments and uses /', () => {
    expect(normalizeDate(' 5-3-2026 ')).toBe('05/03/2026');
    expect(normalizeDate('15-03-2026')).toBe('15/03/2026');
  });
  it('respects mode for ymd', () => {
    expect(normalizeDate('2026-3-5', 'ymd')).toBe('2026/03/05');
  });
  it('passes through if not a recognised shape', () => {
    expect(normalizeDate('not a date')).toBe('not a date');
  });
});

describe('file / postal / iccid', () => {
  it('normalizeFileExtension only trims', () => {
    expect(normalizeFileExtension(' cv.pdf ')).toBe('cv.pdf');
  });
  it('normalizePostalCodeEs preserves leading zeros', () => {
    expect(normalizePostalCodeEs(' 08001 ')).toBe('08001');
  });
  it('normalizeIccid strips spaces and hyphens', () => {
    expect(normalizeIccid(' 8934-0751-0012-3456-789 ')).toBe('89340751001234567' + '89');
  });
});

describe('normalizeEmail', () => {
  it('trims, strips internal whitespace and lowercases', () => {
    expect(normalizeEmail(' Manu@Example.IO ')).toBe('manu@example.io');
    expect(normalizeEmail('m a n u @ x . io')).toBe('manu@x.io');
  });
});

describe('normalizeUrl', () => {
  it('prepends https:// when scheme is missing', () => {
    expect(normalizeUrl(' example.com ')).toBe('https://example.com');
  });
  it('lowercases scheme + host but preserves path/query casing', () => {
    expect(normalizeUrl('HTTPS://Example.COM/MyPath?Q=1')).toBe('https://example.com/MyPath?Q=1');
  });
  it('keeps existing http://', () => {
    expect(normalizeUrl('http://example.org')).toBe('http://example.org');
  });
});

describe('normalizeMobileEs / LandlineEs / TelephoneEs', () => {
  it('strips spaces, hyphens and Spanish country prefix (+34, 0034, 34)', () => {
    expect(normalizeMobileEs('+34 639 01 89 87')).toBe('639018987');
    expect(normalizeMobileEs('0034-639-018-987')).toBe('639018987');
    expect(normalizeMobileEs('34 639 01 89 87')).toBe('639018987');
    expect(normalizeMobileEs('639018987')).toBe('639018987');
  });
  it('landline + telephone use the same rules', () => {
    expect(normalizeLandlineEs('+34 912 34 56 78')).toBe('912345678');
    expect(normalizeTelephoneEs('+34 639 01 89 87')).toBe('639018987');
  });
});

describe('Spanish documents', () => {
  it('normalizeNif / Nie / Cif: trim, uppercase, strip separators', () => {
    expect(normalizeNif(' 12345678z ')).toBe('12345678Z');
    expect(normalizeNif('12-345-678-z')).toBe('12345678Z');
    expect(normalizeNie(' x1234567l ')).toBe('X1234567L');
    expect(normalizeCif(' a58818501 ')).toBe('A58818501');
  });
  it('normalizeBankAccountEs strips separators', () => {
    expect(normalizeBankAccountEs(' 2100 0418 4502 0000 5678 ')).toBe(
      '21000418450200005678',
    );
  });
});

describe('normalizeCreditCard', () => {
  it('strips spaces, hyphens and dots', () => {
    expect(normalizeCreditCard('4111-1111-1111-1111')).toBe('4111111111111111');
    expect(normalizeCreditCard('4111 1111 1111 1111')).toBe('4111111111111111');
    expect(normalizeCreditCard('4111.1111.1111.1111')).toBe('4111111111111111');
  });
});

describe('normalize(name) dispatcher', () => {
  it('returns the right function for every alias', () => {
    expect(normalize('email')(' A@b.IO ')).toBe('a@b.io');
    expect(normalize('correo')(' A@b.IO ')).toBe('a@b.io');
    expect(normalize('movil')(' +34 639 01 89 87 ')).toBe('639018987');
    expect(normalize('mobile')(' +34 639 01 89 87 ')).toBe('639018987');
    expect(normalize('NIF')(' 12345678z ')).toBe('12345678Z');
    expect(normalize('cuentabancaria')(' 2100 0418 4502 0000 5678 ')).toBe(
      '21000418450200005678',
    );
  });
  it('falls back to a trim normalizer for unknown names', () => {
    expect(normalize('thisDoesNotExist')(' hello ')).toBe('hello');
    expect(normalize(/** @type {any} */ (null))(' hello ')).toBe('hello');
  });
  it('exposes normalizers dispatch table as a frozen object', () => {
    expect(Object.isFrozen(normalizers)).toBe(true);
    expect(Object.keys(normalizers).length).toBeGreaterThan(20);
  });
});

describe('normalize → validate composition', () => {
  it('messy input becomes valid after normalize', async () => {
    const { mobileEs, email, nif } = await import('../src/index.js');
    expect(mobileEs(normalizeMobileEs('+34 639 01 89 87'))).toBe(true);
    expect(email(normalizeEmail(' Manu@X.IO '))).toBe(true);
    expect(nif(normalizeNif(' 12345678z '))).toBe(true);
  });
});
