import { describe, it, expect } from 'vitest';
import {
  email,
  url,
  mobileEs,
  landlineEs,
  telephoneEs,
  postalCodeEs,
  iccid,
} from '../src/index.js';

describe('email', () => {
  it('accepts standard addresses', () => {
    expect(email('manu@example.com')).toBe(true);
    expect(email('m.j.fosela+filter@gmail.com')).toBe(true);
    expect(email('user-name@sub.domain.io')).toBe(true);
  });
  it('rejects malformed addresses', () => {
    expect(email('plainaddress')).toBe(false);
    expect(email('@nouser.com')).toBe(false);
    expect(email('manu@')).toBe(false);
    expect(email('manu @example.com')).toBe(false);
    expect(email('manu@example')).toBe(false);
    expect(email('')).toBe(false);
  });
});

describe('url', () => {
  it('accepts http and https URLs with optional path/query', () => {
    expect(url('http://example.com')).toBe(true);
    expect(url('https://www.example.com/path?x=1#hash')).toBe(true);
    expect(url('https://sub.example.io')).toBe(true);
  });
  it('rejects malformed and non-http URLs', () => {
    expect(url('ftp://example.com')).toBe(false);
    expect(url('example.com')).toBe(false);
    expect(url('https://')).toBe(false);
    expect(url('')).toBe(false);
    expect(url('not a url')).toBe(false);
  });
});

describe('mobileEs', () => {
  it('accepts 9-digit numbers starting with 6 or 7', () => {
    expect(mobileEs('600000000')).toBe(true);
    expect(mobileEs('712345678')).toBe(true);
  });
  it('accepts +34 / 34 / 0034 prefix with optional separators', () => {
    expect(mobileEs('+34 600 000 000')).toBe(true);
    expect(mobileEs('+34-600-000-000')).toBe(true);
    expect(mobileEs('0034 600000000')).toBe(true);
    expect(mobileEs('34 600 000 000')).toBe(true);
  });
  it('rejects landlines and bad shapes', () => {
    expect(mobileEs('900000000')).toBe(false); // starts with 9
    expect(mobileEs('60000000')).toBe(false); // 8 digits
    expect(mobileEs('abc')).toBe(false);
    expect(mobileEs('')).toBe(false);
  });
});

describe('landlineEs', () => {
  it('accepts any 9-digit number with optional prefix', () => {
    expect(landlineEs('912345678')).toBe(true);
    expect(landlineEs('+34 912 345 678')).toBe(true);
  });
  it('rejects too-short or alphabetical', () => {
    expect(landlineEs('12345')).toBe(false);
    expect(landlineEs('not-a-phone')).toBe(false);
  });
});

describe('telephoneEs', () => {
  it('matches mobile or landline', () => {
    expect(telephoneEs('600000000')).toBe(true);
    expect(telephoneEs('912345678')).toBe(true);
  });
  it('rejects garbage', () => {
    expect(telephoneEs('abc')).toBe(false);
  });
});

describe('postalCodeEs', () => {
  it('accepts 5-digit codes', () => {
    expect(postalCodeEs('28001')).toBe(true);
    expect(postalCodeEs('08001')).toBe(true);
  });
  it('rejects other lengths or letters', () => {
    expect(postalCodeEs('1234')).toBe(false);
    expect(postalCodeEs('123456')).toBe(false);
    expect(postalCodeEs('2800A')).toBe(false);
    expect(postalCodeEs('')).toBe(false);
  });
});

describe('iccid', () => {
  // Real-world example built so the Luhn-style check passes.
  it('rejects wrong length / wrong prefix / non-digit', () => {
    expect(iccid('1234567890123456789')).toBe(false); // doesn't start with 89
    expect(iccid('89'.padEnd(18, '0'))).toBe(false); // 18 digits
    expect(iccid('not-digits')).toBe(false);
    expect(iccid('')).toBe(false);
  });
});
