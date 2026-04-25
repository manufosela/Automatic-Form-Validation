import { describe, it, expect } from 'vitest';
import {
  integer,
  float,
  number,
  alpha,
  alphaWithDash,
  alphanumeric,
  alphanumericWithSpace,
  date,
} from '../src/index.js';

describe('integer', () => {
  it('accepts integer numbers', () => {
    expect(integer(0)).toBe(true);
    expect(integer(42)).toBe(true);
    expect(integer(-7)).toBe(true);
  });
  it('accepts integer strings', () => {
    expect(integer('0')).toBe(true);
    expect(integer('42')).toBe(true);
    expect(integer('-7')).toBe(true);
  });
  it('rejects floats and non-numeric strings', () => {
    expect(integer(3.14)).toBe(false);
    expect(integer('3.14')).toBe(false);
    expect(integer('42abc')).toBe(false);
    expect(integer('')).toBe(false);
    expect(integer(' ')).toBe(false);
  });
  it('rejects non-string non-number inputs', () => {
    expect(integer(null)).toBe(false);
    expect(integer(undefined)).toBe(false);
    expect(integer({})).toBe(false);
  });
});

describe('float', () => {
  it('accepts integers, decimals and negatives', () => {
    expect(float(3.14)).toBe(true);
    expect(float('3.14')).toBe(true);
    expect(float('-0.5')).toBe(true);
    expect(float('10')).toBe(true);
  });
  it('rejects garbage', () => {
    expect(float('3.14abc')).toBe(false);
    expect(float('abc')).toBe(false);
    expect(float('')).toBe(false);
    expect(float(NaN)).toBe(false);
    expect(float(Infinity)).toBe(false);
  });
});

describe('number', () => {
  it('accepts digits with optional decimal points', () => {
    expect(number('42')).toBe(true);
    expect(number('3.14')).toBe(true);
    expect(number(42)).toBe(true);
  });
  it('rejects letters or signs', () => {
    expect(number('-3.14')).toBe(false);
    expect(number('abc')).toBe(false);
    expect(number('')).toBe(false);
  });
});

describe('alpha', () => {
  it('accepts Latin + accented + ñ', () => {
    expect(alpha('Manu Fosela')).toBe(true);
    expect(alpha('Pérez')).toBe(true);
    expect(alpha('Castaño')).toBe(true);
    expect(alpha('Niño')).toBe(true);
  });
  it('rejects digits and punctuation other than apostrophe', () => {
    expect(alpha('Pérez-Galdós')).toBe(false);
    expect(alpha('M4nu')).toBe(false);
    expect(alpha('')).toBe(false);
  });
});

describe('alphaWithDash', () => {
  it('accepts hyphenated names', () => {
    expect(alphaWithDash('Pérez-Galdós')).toBe(true);
    expect(alphaWithDash('Maria-Jose')).toBe(true);
  });
  it('still rejects digits', () => {
    expect(alphaWithDash('Maria-2')).toBe(false);
  });
});

describe('alphanumeric / alphanumericWithSpace', () => {
  it('accepts letters + digits', () => {
    expect(alphanumeric('Manu42')).toBe(true);
    expect(alphanumeric('M4nu')).toBe(true);
  });
  it('rejects whitespace in alphanumeric()', () => {
    expect(alphanumeric('Manu 42')).toBe(false);
  });
  it('accepts whitespace in alphanumericWithSpace()', () => {
    expect(alphanumericWithSpace('Manu 42')).toBe(true);
  });
});

describe('date', () => {
  it('validates dmy by default', () => {
    expect(date('15/03/2026')).toBe(true);
    expect(date('15-03-2026')).toBe(true);
    expect(date('29/02/2024')).toBe(true); // leap year
  });
  it('respects mdy and ymd modes', () => {
    expect(date('03/15/2026', 'mdy')).toBe(true);
    expect(date('2026-03-15', 'ymd')).toBe(true);
  });
  it('rejects invalid days, months, leap-year violations', () => {
    expect(date('31/02/2026')).toBe(false);
    expect(date('29/02/2025')).toBe(false); // not leap
    expect(date('00/01/2026')).toBe(false);
    expect(date('15/13/2026')).toBe(false);
    expect(date('not a date')).toBe(false);
    expect(date('')).toBe(false);
  });
});
