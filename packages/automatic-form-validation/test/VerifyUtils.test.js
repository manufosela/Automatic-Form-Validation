import { describe, it, expect } from 'vitest';
import { VerifyUtils } from '../src/VerifyUtils.js';

describe('VerifyUtils.isInt', () => {
  // v1.7.0 semantic change: numeric strings are now accepted (before, the
  // legacy `value === parseInt(value)` always returned false for strings,
  // which meant data-tovalidate="int" never validated DOM input values).
  it('accepts integers (number or numeric string)', () => {
    expect(VerifyUtils.isInt(0)).toBe(true);
    expect(VerifyUtils.isInt(42)).toBe(true);
    expect(VerifyUtils.isInt(-17)).toBe(true);
    expect(VerifyUtils.isInt('42')).toBe(true);
    expect(VerifyUtils.isInt('-17')).toBe(true);
  });
  it('rejects floats and non-numeric strings', () => {
    expect(VerifyUtils.isInt(1.5)).toBe(false);
    expect(VerifyUtils.isInt('1.5')).toBe(false);
    expect(VerifyUtils.isInt(NaN)).toBe(false);
    expect(VerifyUtils.isInt('abc')).toBe(false);
    expect(VerifyUtils.isInt('42abc')).toBe(false);
  });
});

describe('VerifyUtils.isFloat', () => {
  it('accepts numbers and numeric strings', () => {
    expect(VerifyUtils.isFloat(1.5)).toBe(true);
    expect(VerifyUtils.isFloat(0)).toBe(true);
    expect(VerifyUtils.isFloat(-3.14)).toBe(true);
    expect(VerifyUtils.isFloat('1.5')).toBe(true);
    expect(VerifyUtils.isFloat('-3.14')).toBe(true);
  });
  it('rejects non-numeric strings', () => {
    expect(VerifyUtils.isFloat('abc')).toBe(false);
    expect(VerifyUtils.isFloat('')).toBe(false);
  });
});

describe('VerifyUtils.isNumber', () => {
  it('accepts digit/dot strings', () => {
    expect(VerifyUtils.isNumber('123')).toBe(true);
    expect(VerifyUtils.isNumber('3.14')).toBe(true);
    expect(VerifyUtils.isNumber('.5')).toBe(true);
  });
  it('rejects non-digit input', () => {
    expect(VerifyUtils.isNumber('abc')).toBe(false);
    expect(VerifyUtils.isNumber('')).toBe(false);
    expect(VerifyUtils.isNumber('12a')).toBe(false);
  });
});

describe('VerifyUtils.isEmail', () => {
  it('accepts canonical emails', () => {
    expect(VerifyUtils.isEmail('user@example.com')).toBe(true);
    expect(VerifyUtils.isEmail('first.last@sub.example.co')).toBe(true);
    expect(VerifyUtils.isEmail('a-b@c-d.es')).toBe(true);
  });
  it('rejects malformed emails', () => {
    expect(VerifyUtils.isEmail('invalid')).toBe(false);
    expect(VerifyUtils.isEmail('@example.com')).toBe(false);
    expect(VerifyUtils.isEmail('no-at-symbol')).toBe(false);
  });
  // FIXED in v1.7.0 (was a "known bug" in 1.6.x): the email regex no longer
  // matches addresses without a proper `.tld` suffix.
  it('rejects emails without a proper TLD (fixed)', () => {
    expect(VerifyUtils.isEmail('no@domain')).toBe(false);
  });
});

describe('VerifyUtils.isUrl', () => {
  it('accepts http and https URLs', () => {
    expect(VerifyUtils.isUrl('https://example.com')).toBe(true);
    expect(VerifyUtils.isUrl('http://www.example.org/path?q=1')).toBe(true);
  });
  it('rejects plain strings', () => {
    expect(VerifyUtils.isUrl('not a url')).toBe(false);
    expect(VerifyUtils.isUrl('example.com')).toBe(false);
  });
});

describe('VerifyUtils.verificaCuentaBancaria', () => {
  it('accepts the trivial all-zeros CCC (d1=d2=0)', () => {
    expect(VerifyUtils.verificaCuentaBancaria('00000000000000000000')).toBe(true);
  });
  it('rejects an account with wrong control digits', () => {
    expect(VerifyUtils.verificaCuentaBancaria('00000000990000000000')).toBe(false);
  });
});

describe('VerifyUtils.verificaNumTarjetaCredito', () => {
  // FIXED in v1.7.0: the legacy implementation compared the first character
  // (a string) against numeric leading-digit set with `[3,4,5,6].includes(...)`
  // which always returned false, so every card was rejected. Now uses Luhn
  // properly — Visa test card is accepted.
  it('accepts the Visa test card (Luhn-valid, fixed)', () => {
    expect(VerifyUtils.verificaNumTarjetaCredito('4111111111111111')).toBe(true);
  });
  it('rejects obviously invalid inputs', () => {
    expect(VerifyUtils.verificaNumTarjetaCredito('1234567890123456')).toBe(false);
    expect(VerifyUtils.verificaNumTarjetaCredito('0000')).toBe(false);
  });
});

describe('VerifyUtils.isAlpha / isAlphaGuion / isAlphaNumeric / isAlphaNumericSpace', () => {
  it('isAlpha accepts letters and rejects digits', () => {
    expect(VerifyUtils.isAlpha('María')).toBe(true);
    expect(VerifyUtils.isAlpha('Ana Belén')).toBe(true);
    expect(VerifyUtils.isAlpha('abc123')).toBe(false);
  });
  it('isAlphaGuion accepts hyphens', () => {
    expect(VerifyUtils.isAlphaGuion('Ana-María')).toBe(true);
    expect(VerifyUtils.isAlphaGuion('abc1')).toBe(false);
  });
  it('isAlphaNumeric accepts letters + digits without spaces', () => {
    expect(VerifyUtils.isAlphaNumeric('abc123')).toBe(true);
    expect(VerifyUtils.isAlphaNumeric('abc 123')).toBe(false);
  });
  it('isAlphaNumericSpace accepts letters + digits + spaces', () => {
    expect(VerifyUtils.isAlphaNumericSpace('abc 123')).toBe(true);
    expect(VerifyUtils.isAlphaNumericSpace('abc!')).toBe(false);
  });
});

describe('VerifyUtils.isDate', () => {
  it('accepts valid dmy dates', () => {
    expect(VerifyUtils.isDate('15/03/2024')).toBe(true);
    expect(VerifyUtils.isDate('01-01-2020')).toBe(true);
  });
  it('accepts valid mdy dates', () => {
    expect(VerifyUtils.isDate('03/15/2024', 'mdy')).toBe(true);
  });
  it('rejects malformed input', () => {
    expect(VerifyUtils.isDate('')).toBe(false);
    expect(VerifyUtils.isDate('not a date')).toBe(false);
    expect(VerifyUtils.isDate('32/01/2024')).toBe(false);
    expect(VerifyUtils.isDate('01/13/2024')).toBe(false);
  });
  it('accepts Feb 29 on a leap year', () => {
    expect(VerifyUtils.isDate('29/02/2024')).toBe(true);
  });

  // FIXED in v1.7.0: previously known bugs in the date validator are corrected.
  it('parses ymd format correctly (fixed)', () => {
    expect(VerifyUtils.isDate('2024-03-15', 'ymd')).toBe(true);
    expect(VerifyUtils.isDate('2024/03/15', 'ymd')).toBe(true);
  });
  it('rejects Feb 29 on a non-leap year (fixed)', () => {
    expect(VerifyUtils.isDate('29/02/2023')).toBe(false);
  });
  it('rejects Apr 31 (fixed)', () => {
    expect(VerifyUtils.isDate('31/04/2024')).toBe(false);
  });
});

describe('VerifyUtils.isFile', () => {
  it('accepts allowed extensions', () => {
    expect(VerifyUtils.isFile('doc.pdf', ['pdf', 'doc'])).toBe(true);
    expect(VerifyUtils.isFile('image.PNG'.toLowerCase(), ['png'])).toBe(true);
  });
  it('rejects disallowed extensions', () => {
    expect(VerifyUtils.isFile('doc.exe', ['pdf', 'doc'])).toBe(false);
  });
});

describe('VerifyUtils.checkNumMovil', () => {
  it('accepts Spanish mobile numbers', () => {
    expect(VerifyUtils.checkNumMovil('666123456')).toBe(true);
    expect(VerifyUtils.checkNumMovil('711234567')).toBe(true);
    expect(VerifyUtils.checkNumMovil('+34 666123456')).toBe(true);
  });
  it('rejects numbers not starting with 6 or 7', () => {
    expect(VerifyUtils.checkNumMovil('812345678')).toBe(false);
    expect(VerifyUtils.checkNumMovil('123')).toBe(false);
  });
});

describe('VerifyUtils.checkNumFijo', () => {
  it('accepts 9-digit landlines', () => {
    expect(VerifyUtils.checkNumFijo('912345678')).toBe(true);
  });
  it('rejects too-short numbers', () => {
    expect(VerifyUtils.checkNumFijo('12345')).toBe(false);
  });
});

describe('VerifyUtils.checkTelephoneNumber', () => {
  it('accepts both mobile and landline', () => {
    expect(VerifyUtils.checkTelephoneNumber('666123456')).toBe(true);
    expect(VerifyUtils.checkTelephoneNumber('912345678')).toBe(true);
  });
  it('rejects invalid inputs', () => {
    expect(VerifyUtils.checkTelephoneNumber('abcdef')).toBe(false);
  });
});

describe('VerifyUtils.checkCodPostal', () => {
  // FIXED in v1.7.0: now accepts string postal codes (and properly handles
  // codes with leading zeros like 08001).
  it('accepts a 5-digit postal code (fixed)', () => {
    expect(VerifyUtils.checkCodPostal('28001')).toBe(true);
    expect(VerifyUtils.checkCodPostal('08001')).toBe(true);
  });
  it('rejects wrong length', () => {
    expect(VerifyUtils.checkCodPostal('123')).toBe(false);
    expect(VerifyUtils.checkCodPostal('ABCDE')).toBe(false);
  });
});

describe('VerifyUtils.checkICCID', () => {
  it('rejects values that do not start with 89', () => {
    expect(VerifyUtils.checkICCID('9934075100020000003')).toBe(0);
  });
  it('rejects values of wrong length', () => {
    expect(VerifyUtils.checkICCID('8934')).toBe(0);
  });
});

// v1.7.0: removed tests for internal helpers (_CalculateLuhn,
// calcDigitoControl2LineaNIF) — they belonged to the old VerifyUtils
// internals and are no longer exposed. The Luhn checksum and DNI digit
// computation live inside @manufosela/form-validators and are tested in
// that package's suite.

describe('VerifyUtils._getLetraNIF (internal)', () => {
  it('returns the expected letter for known DNIs', () => {
    expect(VerifyUtils._getLetraNIF(12345678)).toBe('Z');
    expect(VerifyUtils._getLetraNIF(0)).toBe('T');
  });
});

describe('VerifyUtils.validaNifCifNie', () => {
  // v1.7.0 semantic change: the legacy DOM lookup of #documento_de_identidad
  // (returning 1 for value="PASAPORTE") has been removed. Pure validator now.

  it('returns 0 for empty input', () => {
    expect(VerifyUtils.validaNifCifNie('')).toBe(0);
  });

  it('returns 0 for format-invalid input', () => {
    expect(VerifyUtils.validaNifCifNie('not-a-nif')).toBe(0);
    expect(VerifyUtils.validaNifCifNie('ABC')).toBe(0);
  });

  describe('NIF standard (8 digits + letter)', () => {
    it('accepts valid DNI 12345678Z', () => {
      expect(VerifyUtils.validaNifCifNie('12345678Z')).toBe(1);
    });
    it('rejects DNI with wrong letter', () => {
      expect(VerifyUtils.validaNifCifNie('12345678A')).toBe(-1);
    });
    it('accepts 00000000T', () => {
      expect(VerifyUtils.validaNifCifNie('00000000T')).toBe(1);
    });
  });

  describe('Special NIF K/L/M', () => {
    // K1111111I: suma=3+2+2+2+2=11 -> n=10-1=9 -> letter I (64+9=73)
    it('accepts K1111111I (computed control letter I)', () => {
      expect(VerifyUtils.validaNifCifNie('K1111111I')).toBe(1);
    });
    it('rejects K1111111X (wrong control letter)', () => {
      expect(VerifyUtils.validaNifCifNie('K1111111X')).toBe(-1);
    });
  });

  describe('CIF (A-W)', () => {
    // A58818501 - letter A (entities), numeric control '1'
    it('accepts CIF with numeric control digit (regression AFV-BUG-0005)', () => {
      expect(VerifyUtils.validaNifCifNie('A58818501')).toBe(2);
    });
    // A1111111I - letter control 'I' when n=9
    it('accepts CIF with letter control (A1111111I)', () => {
      expect(VerifyUtils.validaNifCifNie('A1111111I')).toBe(2);
    });
    it('rejects CIF with wrong control', () => {
      expect(VerifyUtils.validaNifCifNie('A58818509')).toBe(-2);
    });
  });

  describe('NIE T-branch', () => {
    it('accepts T12345678 (regression AFV-BUG-0004)', () => {
      expect(VerifyUtils.validaNifCifNie('T12345678')).toBe(3);
    });
    it('accepts T1234567A (T + 8 alphanumerics)', () => {
      expect(VerifyUtils.validaNifCifNie('T1234567A')).toBe(3);
    });
  });

  describe('NIE X/Y/Z branch', () => {
    it('accepts X1234567L', () => {
      expect(VerifyUtils.validaNifCifNie('X1234567L')).toBe(3);
    });
    it('accepts Y1234567X', () => {
      expect(VerifyUtils.validaNifCifNie('Y1234567X')).toBe(3);
    });
    it('accepts Z1234567R', () => {
      expect(VerifyUtils.validaNifCifNie('Z1234567R')).toBe(3);
    });
    it('rejects XYZ NIE with wrong control letter', () => {
      expect(VerifyUtils.validaNifCifNie('X1234567A')).toBe(-3);
    });
  });
});
